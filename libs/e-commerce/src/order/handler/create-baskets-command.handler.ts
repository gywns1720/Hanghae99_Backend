import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateBasketsCommand } from '@lib/e-commerce/order/command/create-baskets.command';
import { BasketRepository } from '@lib/e-commerce/mysql/repository';
import { DateUtils, RandomUtils } from '@lib/common/utils';
import { BasketEntity } from '@lib/e-commerce/mysql/entities';
import { OrderError } from '@lib/e-commerce/order/order-error';
import {
  BasketsCreatedEvent,
  BasketsCreationFailedEvent,
} from '@lib/e-commerce/order/event';

@CommandHandler(CreateBasketsCommand)
export class CreateBasketsCommandHandler
  implements ICommandHandler<CreateBasketsCommand>
{
  constructor(
    private readonly basketRepo: BasketRepository,
    private readonly eventBus: EventBus,
  ) {}
  async execute(command: CreateBasketsCommand): Promise<void> {
    try {
      const { orderId, basketList, productMap } = command;
      const today = DateUtils.today();

      // Primary Key 생성
      const basketIdList = RandomUtils.generatorUnionIDList(
        'basket',
        basketList.length,
      );

      const entities: Partial<BasketEntity>[] = [];
      let totalAmount = 0;
      let totalCount = 0;

      // 장바구니 엔티티 매핑
      for (let i = 0; i < basketList.length; i++) {
        const basket = basketList[i];

        // 제품 존재 여부 재확인
        if (!productMap.has(basket.productId)) {
          this.__throwProductEmpty();
        }

        const amount = Math.max(0, basket.amount);
        const count = Math.max(1, basket.count);
        totalAmount += amount;
        totalCount += count;

        entities.push({
          id: basketIdList[i],
          product_id: basket.productId,
          order_id: orderId,
          amount,
          count,
          created_at: today.toISOString(),
        });
      }

      // 장바구니 아이템 생성
      await this.basketRepo.createItem(entities);

      // 장바구니 생성 완료 이벤트 발행
      this.eventBus.publish(
        new BasketsCreatedEvent(orderId, basketIdList, totalAmount, totalCount),
      );
    } catch (error) {
      // 장바구니 생성 실패 이벤트 발행
      this.eventBus.publish(
        new BasketsCreationFailedEvent(command.orderId, error),
      );
    }
  }

  private __throwProductEmpty() {
    throw OrderError.ProductIDEmpty();
  }
}
