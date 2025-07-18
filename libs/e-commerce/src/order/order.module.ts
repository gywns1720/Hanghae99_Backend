import { Module } from '@nestjs/common';
import OrderHandlerProviders from '@lib/e-commerce/order/handler';
import { CqrsModule } from '@nestjs/cqrs';
import { MysqlModule } from '@lib/e-commerce/mysql/mysql.module';

/**
 * @Module
 */
@Module({
  imports: [CqrsModule, MysqlModule],
  providers: OrderHandlerProviders,
  exports: OrderHandlerProviders,
})
export class OrderModule {}
