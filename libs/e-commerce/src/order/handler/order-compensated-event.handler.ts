import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderCompensatedEvent } from '@lib/e-commerce/order/event';

@EventsHandler(OrderCompensatedEvent)
export class OrderCompensatedEventHandler
  implements IEventHandler<OrderCompensatedEvent>
{
  constructor(private readonly eventBus: EventBus) {}

  async handle(event: OrderCompensatedEvent): Promise<void> {
    // 보상 완료 이벤트 처리 - 로그, 알림 등
    console.log(`Order ${event.orderId} compensated: ${event.reason}`);
  }
}
