import { OmitType } from '@nestjs/swagger';
import { BasketDomain } from '@lib/e-commerce/basket/domain/basket.domain';

/**
 * @domain
 */
export class CreateBasketDomain extends OmitType(BasketDomain, [
  'id',
  'orderId',
] as const) {}
