import { Module } from '@nestjs/common';
import { MysqlModule } from '@lib/e-commerce/mysql/mysql.module';
import { CqrsModule } from '@nestjs/cqrs';
import { DynamicRedisModule } from '@lib/common/module/dynamic-redis.module';
import { ScheduleModule } from '@nestjs/schedule';

/**
 * @Module
 */
@Module({
  imports: [
    CqrsModule,
    ScheduleModule.forRoot({
      intervals: true,
    }),
    MysqlModule,
    DynamicRedisModule.forRootAsync({ isGlobal: true }),
  ],
  exports: [CqrsModule, MysqlModule, DynamicRedisModule],
})
export class ECommerceModule {}
