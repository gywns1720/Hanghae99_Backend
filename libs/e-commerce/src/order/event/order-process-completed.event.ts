import { IEvent } from '@nestjs/cqrs';
import { IOrderPK } from '@lib/e-commerce/order/i-order';
import { IBasketPK } from '@lib/e-commerce/basket/i-basket';
import { ICount, IMoney } from '@lib/common/type';
import { IUserPK } from '@lib/e-commerce/user/i-user';

export class OrderProcessCompletedEvent implements IEvent {
  constructor(
    public readonly orderId: IOrderPK,
    public readonly userId: IUserPK,
    public readonly basketIdList: IBasketPK[],
    public readonly totalAmount: IMoney,
    public readonly totalCount: ICount,
  ) {}
}
