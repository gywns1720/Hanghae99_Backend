// #region [EXPORT]
import { Provider } from '@nestjs/common';
import { OrderRepository } from '@lib/e-commerce/mysql/repository/order.repository';
import { ProductRepository } from '@lib/e-commerce/mysql/repository/product.repository';
import { UserRepository } from '@lib/e-commerce/mysql/repository/user.repository';
import { BasketRepository } from '@lib/e-commerce/mysql/repository/basket.repository';

export * from './order.repository';
export * from './product.repository';
export * from './user.repository';
export * from './basket.repository';
const MySqlRepositories: Provider[] = [
  OrderRepository,
  ProductRepository,
  UserRepository,
  BasketRepository,
];
export default MySqlRepositories;
// #endregion
