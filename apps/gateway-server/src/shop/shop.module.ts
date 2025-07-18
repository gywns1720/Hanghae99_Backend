import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { PointController } from './point.controller';
import { ProductController } from './product.controller';

/**
 * @Module
 */
@Module({
  controllers: [OrderController, PointController, ProductController],
})
export class ShopModule {}
