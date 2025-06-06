import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IFindOneProductResponse } from '@lib/e-commerce/product/interface';
import { FindManyProductQuery } from '@lib/e-commerce/product/query/find-many-product.query';

@QueryHandler(FindManyProductQuery)
export class FindManyProductHandler
  implements IQueryHandler<FindManyProductQuery>
{
  /**
   * TODO 단일 제품 검색 쿼리 비즈니스 로직 구현하기
   * @param query
   */
  async execute(query: FindManyProductQuery): Promise<IFindOneProductResponse> {
    return {};
  }
}
