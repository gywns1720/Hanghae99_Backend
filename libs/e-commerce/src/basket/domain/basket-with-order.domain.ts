import { BasketDomain } from '@lib/e-commerce/basket/domain/basket.domain';
import { IBasketWithOrderInfo } from '@lib/e-commerce/basket/i-basket';
import { IOrder } from '@lib/e-commerce/order/i-order';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @domain
 */
export class BasketWithOrderDomain
  extends BasketDomain
  implements IBasketWithOrderInfo
{
  @ApiProperty({})
  orderInfo: IOrder;
}
