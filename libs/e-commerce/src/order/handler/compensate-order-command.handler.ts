import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CompensateOrderCommand } from '@lib/e-commerce/order/command/compensate-order.command';
import {
  BasketRepository,
  OrderRepository,
} from '@lib/e-commerce/mysql/repository';
import { OrderCompensatedEvent } from '@lib/e-commerce/order/event';
import { IWhere } from '@lib/common/type';

@CommandHandler(CompensateOrderCommand)
export class CompensateOrderCommandHandler
  implements ICommandHandler<CompensateOrderCommand>
{
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly basketRepo: BasketRepository,
    private readonly eventBus: EventBus,
  ) {}
  async execute(command: CompensateOrderCommand): Promise<any> {
    const { orderId, failedStep, error } = command;

    try {
      const whereOpt: Record<'default' | 'basket' | string, IWhere> = {
        default: {
          where: 'id = :id',
          parameters: { id: orderId },
        },
        basket: {
          where: 'order_id = :id',
          parameters: { id: orderId },
        },
      };
      switch (failedStep) {
        case 'ProductValidation':
          // 제품 검증 실패 시 주문만 삭제
          await this.orderRepo.deleteItem([whereOpt.default]);
          break;

        case 'BasketCreation':
          // 장바구니 생성 실패 시 주문 삭제
          await this.orderRepo.deleteItem([whereOpt.default]);
          break;

        case 'OrderProcessing':
          // 전체 프로세스 실패 시 모든 데이터 삭제
          await this.basketRepo.deleteItem([whereOpt.basket]);
          await this.orderRepo.deleteItem([whereOpt.default]);
          break;
      }

      this.eventBus.publish(
        new OrderCompensatedEvent(
          orderId,
          `${failedStep}: ${error?.message || 'Unknown'}`,
        ),
      );
    } catch (compensationError) {
      console.error(
        `Compensation failed for order ${orderId}:`,
        compensationError,
      );
      // 보상 실패 시 수동 처리를 위한 알림 또는 로그
    }
  }
}
