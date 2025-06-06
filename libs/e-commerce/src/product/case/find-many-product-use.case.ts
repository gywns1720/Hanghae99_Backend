import {
  IFindManyItem,
  IFindTotal,
  IPageAndQueryRunner,
} from '@lib/common/type';
import { ProductDomain } from '@lib/e-commerce/product/domain/product.domain';
import { IFindManyProductResponse } from '@lib/e-commerce/product/interface';
import { FindOptionsWhere, MoreThanOrEqual } from 'typeorm';
import { FindManyProductQuery } from '@lib/e-commerce/product/query/find-many-product.query';

/**
 * @summary 테스트 코드에서 검색 관련 UseCase
 */
export default class FindManyProductUseCase {
  constructor(
    protected readonly produceRepo: IFindManyItem<ProductDomain> &
      IFindTotal<ProductDomain>,
  ) {}

  async execute(
    query: FindManyProductQuery,
    options: Pick<IPageAndQueryRunner, 'size' | 'runner'> = { size: 20 },
  ): Promise<IFindManyProductResponse> {
    const dto = query.props;
    const opt = query.options;
    const whereOpt: FindOptionsWhere<ProductDomain> = {
      name:
        typeof dto.name !== 'string' || dto.name.trim().length <= 0
          ? undefined
          : `${dto.name}%`,
      stock: (() => {
        const s = dto.stock;
        if (typeof s !== 'number' || isNaN(s) || !isFinite(s)) return undefined;
        return s > 0 ? MoreThanOrEqual(s) : undefined;
      })(),
    };

    const currPage = Math.max(1, opt.page);

    /*
     * Page = 1, size = 20 인 경우 1 ~ 20
     * Page = 2, size = 20 21 ~ 40
     */
    const [total, items] = await Promise.all([
      this.produceRepo.total({ where: whereOpt }),
      this.produceRepo.findManyItems({
        where: whereOpt,
        take: options.size,
        skip: (currPage - 1) * options.size,
        order: {
          createdAt: 'desc',
        },
        runner: opt.runner,
      }),
    ]);
    return {
      items: items,
      total: total,
    };
  }
}
