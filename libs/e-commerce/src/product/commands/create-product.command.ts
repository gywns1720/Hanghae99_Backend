import { ProductDomain } from '@lib/e-commerce/product/domain/product.domain';

/**
 * @summary 제품 생상 커맨드 모듈
 */
export class CreateProductCommand {
  constructor(public readonly domain: ProductDomain) {}
}
