import { Module } from '@nestjs/common';
import { ECommerceService } from './e-commerce.service';

@Module({
  providers: [ECommerceService],
  exports: [ECommerceService],
})
export class ECommerceModule {}
