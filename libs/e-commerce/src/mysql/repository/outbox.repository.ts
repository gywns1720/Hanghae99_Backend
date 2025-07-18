import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import Orm from '@lib/common/abstract/orm.abstract';
import { OutboxEntity } from '@lib/e-commerce/mysql/entities';

/**
 * @Repository
 */
@Injectable()
export class OutboxRepository extends Orm<OutboxEntity> {
  constructor(readonly dataSource: DataSource) {
    super(OutboxEntity, dataSource);
  }
}
