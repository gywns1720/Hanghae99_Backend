import { IUserPK } from '@lib/e-commerce/user/i-user';
import { IBasket } from '@lib/e-commerce/basket/i-basket';
import { OrderStatus } from '@lib/e-commerce/order/order-status.enum';

export type IOrderPK = string;

/**
 * @extends IOrder 주문 인터페이스
 */
export interface IOrderWithBasketList extends IOrder {
  basketList?: IBasket[];
}

export interface IOrder {
  id: IOrderPK;
  userId: IUserPK;
  status: OrderStatus;
}
