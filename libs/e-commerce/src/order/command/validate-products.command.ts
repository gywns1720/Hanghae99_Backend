import { ICommand } from '@nestjs/cqrs';
import { IProduct } from '@lib/e-commerce/product/i-product';
import { IOrderPK } from '@lib/e-commerce/order/i-order';

export class ValidateProductsCommand implements ICommand {
  constructor(
    public readonly orderId: IOrderPK,
    public readonly productIds: IProduct[],
  ) {}
}
