import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetEventCouponCommand } from '@lib/e-commerce/coupon/command/set-event-coupon.command';
import { Inject } from '@nestjs/common';
import ProviderConst from '@lib/common/const/provider.const';
import { IRedis } from '@lib/common/type';
import { MathUtils } from '@lib/common/utils';

/**
 * @summary 이벤트 쿠폰 레디스 셋팅
 *
 * - 레디스 이벤트 키 리스트를 관리하는 배열 필요.
 * - 이벤트 추가 및 발행은 DB로 히스토리 관리 필요.
 * - switch 문 말고 State Pattern 쓸지 고민중
 *
 */
@CommandHandler(SetEventCouponCommand)
export class SetEventCouponCommandHandler
  implements ICommandHandler<SetEventCouponCommand>
{
  constructor(@Inject(ProviderConst.Redis) protected readonly redis: IRedis) {}
  async execute(command: SetEventCouponCommand): Promise<any> {
    const redisKey = ProviderConst.RedisKey.Coupon.Stock(command.couponId);
    switch (command.status) {
      case 'init':
        await this.redis.set(
          redisKey,
          command.stock,
          'EX',
          (command.expiresMinutes || 5) * 60,
        );
        break;
      case 'add':
        const remainStockStr = await this.redis.get(redisKey);
        const ttl = await this.redis.ttl(redisKey);
        let remainStockCnt = 0;
        if (typeof remainStockStr === 'string' && !isNaN(+remainStockStr)) {
          remainStockCnt = MathUtils.clamp(parseInt(remainStockStr), 0, 9999);
        }
        remainStockCnt += command.stock;
        if (ttl > 0) {
          await this.redis.set(redisKey, remainStockCnt, 'EX', ttl);
        } else {
          await this.redis.set(
            redisKey,
            remainStockCnt,
            'EX',
            (command.expiresMinutes || 5) * 60,
          );
        }
    }
  }
}
