import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import MysqlEntities from '@lib/e-commerce/mysql/entities';
import MySqlRepositories from '@lib/e-commerce/mysql/repository';

/**
 * @Module
 */
@Module({
  imports: [TypeOrmModule.forFeature(MysqlEntities)],
  providers: [...MySqlRepositories],
  exports: [...MySqlRepositories],
})
export class MysqlModule {}
