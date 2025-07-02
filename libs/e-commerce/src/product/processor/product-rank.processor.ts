import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IRedis } from '@lib/common/type';
import ProviderConst from '@lib/common/const/provider.const';
import { OutboxRepository } from '@lib/e-commerce/mysql/repository/outbox.repository';
import { Interval } from '@nestjs/schedule';
import { QueryRunner } from 'typeorm';
import { OutboxEntity } from '@lib/e-commerce/mysql/entities';
import { IProductRankOutboxJsonData } from '@lib/e-commerce/product/i-product';
import * as Joi from 'joi';
import { OutboxStatus } from '@lib/e-commerce/mysql/outbox-status.enum';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindManyOutboxQuery } from '@lib/e-commerce/mysql/query/find-many-outbox.query';
import { UpdateOutboxCommand } from '@lib/e-commerce/mysql/command';
/**
 * @summary 제품 랭킹 프로세서
 */
@Injectable()
export class ProductRankProcessor {
  constructor(
    @Inject(ProviderConst.Redis) protected readonly redis: IRedis,
    protected readonly queryBus: QueryBus,
    protected readonly commandBus: CommandBus,
    protected readonly repo: OutboxRepository,
  ) {}

  // 10000ms 마다 반복
  @Interval(10000)
  async rankUpdate() {
    console.log('RankUpdate Start');

    // Outbox 10개 가져오기
    const events: OutboxEntity[] =
      await this.queryBus.execute<FindManyOutboxQuery>(
        new FindManyOutboxQuery(),
      );

    // 검증 스키마
    const eventSchema = Joi.object<IProductRankOutboxJsonData>({
      items: Joi.array().items(
        Joi.object({
          productId: Joi.number().required(),
          amount: Joi.number().required(),
          price: Joi.number().required(),
        }),
      ),
    });

    const errorIdArr: number[] = [];
    for (const event of events) {
      try {
        // 데이터 응답값
        const data: IProductRankOutboxJsonData =
          event.payload as IProductRankOutboxJsonData;
        // 검증
        await eventSchema.validateAsync(data).catch((err) => {
          console.error(
            `[${event.id}]Event :  ${event.event_type} Validate Error`,
            err,
          );
          throw new BadRequestException('Validator Error ');
        });

        await this.repo.transaction(async (runner: QueryRunner) => {
          // 등록
          let retry = 0;
          let currIdx = 0;
          while (currIdx < data.items.length) {
            try {
              const item = data.items[currIdx];
              await this.redis
                .eval(
                  `
                    redis.call("ZINCRBY", KEYS[1], ARGV[1], ARGV[3])
                    redis.call("ZINCRBY", KEYS[2], ARGV[2], ARGV[3])
                  `,
                  2,
                  ProviderConst.RedisKey.Product.RankingAmount,
                  ProviderConst.RedisKey.Product.RankingPrice,
                  item.amount.toString(),
                  item.price.toString(),
                  item.productId.toString(),
                )
                .catch((err) => {
                  console.error(
                    `[${event.id}]Event :  ${event.event_type} Redis Error`,
                    err,
                  );
                  throw new InternalServerErrorException('Redis Error');
                });

              await this.commandBus.execute(
                new UpdateOutboxCommand({
                  id: event.id,
                  status: OutboxStatus.SENT,
                  writeSentAt: true,
                  retryCount: 0,
                  runner,
                }),
              );

              currIdx += 1;
              retry = 0;
            } catch (err) {
              if (retry >= 5) {
                retry = 0;
                currIdx += 1;
                await this.commandBus.execute(
                  new UpdateOutboxCommand({
                    id: event.id,
                    status: OutboxStatus.FAILED,
                    retryCount: 5,
                    runner,
                  }),
                );
                throw err;
              } else {
                retry += 1;
              }
            }
          }
        });
      } catch (err) {
        errorIdArr.push(event.id);
      }
    }

    if (errorIdArr.length > 0) {
      await this.commandBus.execute(
        new UpdateOutboxCommand({
          id: errorIdArr,
          status: OutboxStatus.FAILED,
          retryCount: 5,
        }),
      );
    }

    console.log('RankUpdate End');
  }
}
