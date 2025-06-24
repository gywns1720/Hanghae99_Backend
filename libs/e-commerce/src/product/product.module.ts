import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHandler } from '@lib/e-commerce/product/handler/create-product.handler';
import { FindOneProductHandler } from '@lib/e-commerce/product/handler/find-one-product.handler';
import { FindManyProductHandler } from '@lib/e-commerce/product/handler/find-many-product.handler';
import { PurchaseProductHandler } from '@lib/e-commerce/product/handler/purchase-product.handler';

/**
 * @Module 제품 모듈
 */
@Module({
  imports: [CqrsModule],
  providers: [
    CreateProductHandler,
    FindOneProductHandler,
    FindManyProductHandler,
    PurchaseProductHandler,
  ],
  exports: [CqrsModule],
})
export class ProductModule {}
