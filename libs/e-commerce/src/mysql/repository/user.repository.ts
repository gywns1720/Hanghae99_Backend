import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import Orm from '@lib/common/abstract/orm.abstract';
import { UserEntity } from '@lib/e-commerce/mysql/entities/user.entity';

/**
 * @Repository
 */
@Injectable()
export class UserRepository extends Orm<UserEntity> {
  constructor(readonly dataSource: DataSource) {
    super(UserEntity, dataSource);
  }
}
