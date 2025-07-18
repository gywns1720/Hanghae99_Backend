import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import Orm from '@lib/common/abstract/orm.abstract';
import { ProductEntity } from '@lib/e-commerce/mysql/entities/product.entity';

/**
 * @Repository
 */
@Injectable()
export class ProductRepository extends Orm<ProductEntity> {
  constructor(readonly dataSource: DataSource) {
    super(ProductEntity, dataSource);
  }
}
