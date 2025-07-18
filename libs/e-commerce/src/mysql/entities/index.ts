// #region [EXPORT]

import { BasketEntity } from '@lib/e-commerce/mysql/entities/basket.entity';
import { OrderEntity } from '@lib/e-commerce/mysql/entities/order.entity';
import { ProductEntity } from '@lib/e-commerce/mysql/entities/product.entity';
import { UserEntity } from '@lib/e-commerce/mysql/entities/user.entity';
import { OutboxEntity } from '@lib/e-commerce/mysql/entities/outbox.entity';
import { CouponEntity } from '@lib/e-commerce/mysql/entities/coupon.entity';

export * from './order.entity';
export * from './user.entity';
export * from './product.entity';
export * from './basket.entity';
export * from './outbox.entity';
const MysqlEntities = [
  BasketEntity,
  OrderEntity,
  ProductEntity,
  UserEntity,
  OutboxEntity,
  CouponEntity,
];
export default MysqlEntities;
// #endregion
