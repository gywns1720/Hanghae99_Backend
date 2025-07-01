import { Module } from '@nestjs/common';
import { ShopModule } from './shop/shop.module';
import { ECommerceModule } from '@lib/e-commerce';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';

/**
 * @Module
 */
@Module({
  imports: [
    ShopModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `./.env.${process.env.NODE_ENV || 'local'}`],
    }),
    ECommerceModule,
  ],
})
export class GatewayRootModule {}
