import { ICommand } from '@nestjs/cqrs';
import { ProductEntity } from '@lib/e-commerce/mysql/entities';
import { IOrderPK } from '@lib/e-commerce/order/i-order';
import { IProduct } from '@lib/e-commerce/product/i-product';
import { ICount, IMoney } from '@lib/common/type';

export class CreateBasketsCommand implements ICommand {
  constructor(
    public readonly orderId: IOrderPK,
    public readonly basketList: Array<{
      productId: IProduct;
      amount: IMoney;
      count: ICount;
    }>,
    public readonly productMap: Map<number, ProductEntity>,
  ) {}
}
