import { Module } from '@nestjs/common';
import { ShopModule } from './shop/shop.module';

/**
 * @Module
 */
@Module({
  imports: [ShopModule],
})
export class GatewayRootModule {}
