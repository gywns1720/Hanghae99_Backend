import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {
  OrderCreatedEvent,
  OrderProcessCompletedEvent,
} from '@lib/e-commerce/order/event';

@EventsHandler(OrderProcessCompletedEvent)
export class OrderProcessCompletedEventHandler
  implements IEventHandler<OrderProcessCompletedEvent>
{
  constructor(private readonly eventBus: EventBus) {}

  async handle(event: OrderProcessCompletedEvent): Promise<void> {
    // 최종 완료 이벤트 처리 - 외부 시스템에 알림 등
    console.log(`Order ${event.orderId} completed successfully`);

    // 도메인 이벤트 발행 (기존 OrderCreatedEvent와 동일한 구조)
    this.eventBus.publish(new OrderCreatedEvent(event.orderId, event.userId));
  }
}
