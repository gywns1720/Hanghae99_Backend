import { IEvent } from '@nestjs/cqrs';
import { IOrderPK } from '@lib/e-commerce/order/i-order';
import { IUserPK } from '@lib/e-commerce/user/i-user';

export class OrderCreatedEvent implements IEvent {
  constructor(
    public readonly orderId: IOrderPK,
    public readonly userId: IUserPK,
  ) {}
}
