import { Module } from '@nestjs/common';
import { ShopModule } from './shop/shop.module';
import { ECommerceModule } from '@lib/e-commerce';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { UserGatewayModule } from './user/user-gateway.module';

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
    UserGatewayModule,
    ECommerceModule,
  ],
})
export class GatewayRootModule {}
