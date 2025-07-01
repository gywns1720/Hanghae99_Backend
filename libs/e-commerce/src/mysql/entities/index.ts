// #region [EXPORT]

import { BasketEntity } from '@lib/e-commerce/mysql/entities/basket.entity';
import { OrderEntity } from '@lib/e-commerce/mysql/entities/order.entity';
import { ProductEntity } from '@lib/e-commerce/mysql/entities/product.entity';
import { UserEntity } from '@lib/e-commerce/mysql/entities/user.entity';

export * from './order.entity';
export * from './user.entity';
export * from './product.entity';
export * from './basket.entity';
const MysqlEntities = [BasketEntity, OrderEntity, ProductEntity, UserEntity];
export default MysqlEntities;
// #endregion
