import { ICommand } from '@nestjs/cqrs';
import { IOrderPK } from '@lib/e-commerce/order/i-order';
import { IProduct } from '@lib/e-commerce/product/i-product';

export class ValidateOrderProductsCommand implements ICommand {
  constructor(
    public readonly orderId: IOrderPK,
    public readonly productIds: IProduct[],
  ) {}
}
