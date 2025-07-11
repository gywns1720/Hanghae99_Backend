import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * @Controller
 */
@Controller('shop/order')
@ApiTags('Order')
export class OrderController {
  constructor() {}

  @ApiOperation({
    summary: '주문 생성',
    description: '유저가 주문을 생성 합니다.',
  })
  @Post()
  async createOrder() {}

  @Get(':userId')
  async getOrdersByCustomer(
    @Param('userId', new DefaultValuePipe('')) id: string,
  ) {}

  @Put()
  async cancelOrder() {}
}
