import { ICount, IMoney, IPrimaryKey } from '@lib/common/type';
import { IProduct } from '@lib/e-commerce/product/i-product';
import { IOrder, IOrderPK } from '@lib/e-commerce/order/i-order';

export type IBasketPK = IPrimaryKey;
export interface IBasket {
  id: IBasketPK;
  productId: IProduct;
  amount: IMoney;
  count: ICount;
  orderId: IOrderPK;
}
export interface IBasketWithOrderInfo extends IBasket {
  orderInfo?: IOrder;
}
