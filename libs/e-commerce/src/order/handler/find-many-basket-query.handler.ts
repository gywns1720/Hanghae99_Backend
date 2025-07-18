import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import {
  FindManyBasketQuery,
  IFindManyBasketQueryRes,
} from '@lib/e-commerce/order/query/find-many-basket.query';
import { BasketEntity } from '@lib/e-commerce/mysql/entities';
import {
  BasketRepository,
  ProductRepository,
} from '@lib/e-commerce/mysql/repository';
import { ICount, IMoney } from '@lib/common/type';

@QueryHandler(FindManyBasketQuery)
export class FindManyBasketQueryHandler
  implements IQueryHandler<FindManyBasketQuery>
{
  constructor(protected readonly repository: BasketRepository) {}
  async execute(query: FindManyBasketQuery): Promise<IFindManyBasketQueryRes> {
    const entities: BasketEntity[] = await this.repository.findItemMany({
      where: {
        order_id: query.orderId,
      },
      relations: {
        orderInfo: true,
        productInfo: true,
      },
    });
    let totalAmount: IMoney = 0;
    const totalCount: ICount = entities.length;
    entities.forEach((entity) => {
      if (entity.productInfo) {
        totalAmount += entity.productInfo.price;
      }
    });

    return {
      entities,
      totalAmount,
      totalCount,
    };
  }
}
