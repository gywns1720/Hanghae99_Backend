import { FindManyLimitSizeQuery } from '@lib/common/queries';
import type { ILimitOptions } from '@lib/common/type';

/**
 * @summary 여러개의 상품을 조회하는 쿼리
 * @extends FindManyLimitSizeQuery
 */
export class FindManyProductQuery extends FindManyLimitSizeQuery {
  constructor(
    public readonly id: string,
    public options: ILimitOptions = {
      type: 'page',
      page: 1,
      size: 50,
    },
  ) {
    super(options);
  }
}
