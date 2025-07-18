import { Module } from '@nestjs/common';
import { OrderServerController } from './order-server.controller';
import { OrderServerService } from './order-server.service';

@Module({
  imports: [],
  controllers: [OrderServerController],
  providers: [OrderServerService],
})
export class OrderServerModule {}
