// #region [EXPORT]
import type { ObjectLiteral } from 'typeorm';
import { ProductEntity } from '@lib/e-commerce/mysql/entities/product.entity';
import { LocalSignEntity } from '@lib/e-commerce/mysql/entities/local-sign.entity';
import { UserProfileEntity } from '@lib/e-commerce/mysql/entities/user-profile.entity';
import { UserMasterEntity } from '@lib/e-commerce/mysql/entities/user-master.entity';

export * from './product.entity';
export * from './local-sign.entity';
export * from './user-profile.entity';
export * from './user-master.entity';

const ECommerceEntities: ObjectLiteral[] = [
  ProductEntity,
  LocalSignEntity,
  UserProfileEntity,
  UserMasterEntity,
];
export default ECommerceEntities;
// #endregion
