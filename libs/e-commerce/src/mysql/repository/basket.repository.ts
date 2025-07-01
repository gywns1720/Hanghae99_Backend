import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BasketEntity } from '@lib/e-commerce/mysql/entities/basket.entity';
import Orm from '@lib/common/abstract/orm.abstract';

/**
 * @Repository
 */
@Injectable()
export class BasketRepository extends Orm<BasketEntity> {
  constructor(readonly dataSource: DataSource) {
    super(BasketEntity, dataSource);
  }
}
