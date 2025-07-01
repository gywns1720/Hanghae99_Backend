import { Module } from '@nestjs/common';
import { MysqlModule } from '@lib/e-commerce/mysql/mysql.module';
import { CqrsModule } from '@nestjs/cqrs';

/**
 * @Module
 */
@Module({
  imports: [CqrsModule, MysqlModule],
  exports: [CqrsModule, MysqlModule],
})
export class ECommerceModule {}
