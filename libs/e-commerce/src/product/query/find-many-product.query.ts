import { FindManyLimitSizeQuery } from '@lib/common/queries';
import type { IPageAndQueryRunner } from '@lib/common/type';

type FindManyProductQueryProps = {
  readonly name?: string;
  readonly stock?: number;
};

/**
 * @summary 여러개의 상품을 조회하는 쿼리
 * @extends FindManyLimitSizeQuery
 */
export class FindManyProductQuery extends FindManyLimitSizeQuery {
  constructor(
    public readonly props: FindManyProductQueryProps,
    public readonly options: IPageAndQueryRunner = {
      type: 'page',
      page: 1,
      size: 50,
    },
  ) {
    super(options);
  }
}
