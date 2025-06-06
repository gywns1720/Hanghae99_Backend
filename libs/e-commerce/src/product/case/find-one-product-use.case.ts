import { IFindOneItem, INullUndefined } from '@lib/common/type';
import { ProductDomain } from '@lib/e-commerce/product/domain/product.domain';
import { FindOneProductQuery } from '@lib/e-commerce/product/query/find-one-product.query';
import { ProductEntity } from '@lib/e-commerce/mysql/entities';
import { ProductMapper } from '@lib/e-commerce/product/utils';

type ICacheService = {
  get: (key: string) => Promise<ProductDomain | null>;
  set: (key: string, value: ProductDomain | null, ttl: number) => Promise<void>;
};
export default class FindOneProductUseCase {
  constructor(
    protected readonly produceRepo: IFindOneItem<ProductEntity>,
    protected readonly cacheService: INullUndefined<ICacheService> = null,
  ) {}

  async execute(query: FindOneProductQuery): Promise<ProductDomain> {
    const isCacheSupported: boolean = !!this._isCacheSupported(
      this.cacheService,
    );

    // 캐시 서비스 지원되는 경우 캐시 검색
    if (isCacheSupported) {
      const domain = await this._findCache(this.cacheService, query.id);
      if (domain instanceof ProductDomain) return domain;
    }

    // 데이터 검색
    const entity = await this.produceRepo.findOneItem(query.id);

    if (!entity) {
      return null;
    }

    // Entity -> Domain 변환
    const parseDomain = ProductMapper.toDomain(entity);

    // 캐시 지원되면 캐시 저장
    if (isCacheSupported) {
      await this._saveCache(this.cacheService, parseDomain, query.ttl);
    }

    return parseDomain;
  }

  /**
   * @summary 캐시 데이터 검색
   * @param cacheService {ICacheService} 캐시 서비스
   * @param id {string} 찾을 아이디
   * @private
   * @todo CacheUtils 같은거로 빼도 될거 같음.
   */
  private async _findCache(cacheService: ICacheService, id: string) {
    return await cacheService.get(this._getCacheKey(id)).catch(() => null);
  }

  /**
   * @summary 캐시 데이터 저장
   * @param cacheService {ICacheService} 캐시 서비스
   * @param domain {ProductDomain} 도메인
   * @param ttl {number} 유효시간 (초)
   * @private
   * @todo CacheUtils 같은거로 빼도 될거 같음.
   */
  private async _saveCache(
    cacheService: ICacheService,
    domain: ProductDomain,
    ttl: number,
  ) {
    await cacheService
      .set(this._getCacheKey(domain.id), domain, ttl)
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * @summary 캐시 반환
   * @param id
   * @private
   */
  private _getCacheKey(id: string) {
    return `find/one/product/${id}`;
  }

  /**
   * @summary 캐시 서비스 지원하는가?
   * @param service {ICacheService | null | undefined} 지원되는 캐시서비스 인가?
   * @private
   * 타입 가드 지원
   */
  private _isCacheSupported(
    service: ICacheService | null | undefined,
  ): service is ICacheService {
    return !!service && !!service.set && !!service.get;
  }
}
