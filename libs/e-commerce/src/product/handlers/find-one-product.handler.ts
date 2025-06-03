import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneProductQuery } from '@lib/e-commerce/product/queries/find-one-product.query';
import { IFindOneProductResponse } from '@lib/e-commerce/product/interface';

@QueryHandler(FindOneProductQuery)
export class FindOneProductHandler
  implements IQueryHandler<FindOneProductQuery>
{
  /**
   * TODO 단일 제품 검색 쿼리 비즈니스 로직 구현하기
   * @param query
   */
  async execute(query: FindOneProductQuery): Promise<IFindOneProductResponse> {
    return {};
  }
}
