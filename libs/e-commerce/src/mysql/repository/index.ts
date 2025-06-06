import { Provider } from '@nestjs/common';
import { ProductRepository } from '@lib/e-commerce/mysql/repository/product.repository';

const ECommerceRepositories: Provider[] = [ProductRepository];
export default ECommerceRepositories;
