import { ICommand } from '@nestjs/cqrs';
import { IUserPK } from '@lib/e-commerce/user/i-user';
import { CreateBasketDomain } from '@lib/e-commerce/basket/domain/create-basket.domain';
import { IOrderPK } from '@lib/e-commerce/order/i-order';
import { IBasketPK } from '@lib/e-commerce/basket/i-basket';
import { ICount, IMoney } from '@lib/common/type';
// import { IBasketPK } from '@lib/e-commerce/basket/i-basket';
// import { ICount, IMoney } from '@lib/common/type';

/**
 * @summary 주문 커맨드
 */
export class CreateOrderCommand implements ICommand {
  constructor(
    readonly userId: IUserPK,
    readonly basketList: CreateBasketDomain[],
  ) {}
}

export interface ICreateOrderCommandRes {
  orderId: IOrderPK;
  basketIdList: IBasketPK[];
  totalAmount: IMoney;
  totalCount: ICount;
}
