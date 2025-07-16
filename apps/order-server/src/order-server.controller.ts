import { Controller, Get } from '@nestjs/common';
import { OrderServerService } from './order-server.service';

@Controller()
export class OrderServerController {
  constructor(private readonly orderServerService: OrderServerService) {}

  @Get()
  getHello(): string {
    return this.orderServerService.getHello();
  }
}
