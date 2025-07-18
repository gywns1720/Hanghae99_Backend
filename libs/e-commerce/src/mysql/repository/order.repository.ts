import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import Orm from '@lib/common/abstract/orm.abstract';
import { OrderEntity } from '@lib/e-commerce/mysql/entities/order.entity';

/**
 * @Repository
 */
@Injectable()
export class OrderRepository extends Orm<OrderEntity> {
  constructor(readonly dataSource: DataSource) {
    super(OrderEntity, dataSource);
  }
}
