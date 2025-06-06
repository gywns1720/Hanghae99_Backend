import { ProductDomain } from '@lib/e-commerce/product/domain/product.domain';

export interface IFindManyProductResponse {
  items: ProductDomain[];
  total: number;
}
