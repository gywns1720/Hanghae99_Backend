import { IQuery } from '@nestjs/cqrs';
import { IOrderPK } from '@lib/e-commerce/order/i-order';
import { BasketEntity } from '@lib/e-commerce/mysql/entities';
import { ICount, IMoney } from '@lib/common/type';

export class FindManyBasketQuery implements IQuery {
  constructor(readonly orderId: IOrderPK) {}
}

export interface IFindManyBasketQueryRes {
  entities: BasketEntity[];
  totalAmount: IMoney;
  totalCount: ICount;
}
