import { ApiProperty } from '@nestjs/swagger';
import { ICount, IMoney, IPrimaryKey } from '@lib/common/type';
import { IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { IProduct } from '@lib/e-commerce/product/i-product';
import { Type } from 'class-transformer';
import { IBasket, IBasketPK } from '@lib/e-commerce/basket/i-basket';
import { IOrderPK } from '@lib/e-commerce/order/i-order';
import { IsCustomNumber } from '@lib/common/decorator';

/**
 * @domain
 */
export class BasketDomain implements IBasket {
  @ApiProperty({ example: 'Primary Key' })
  @MinLength(2)
  @MaxLength(36)
  @IsString()
  id: IBasketPK;

  @ApiProperty({ example: 'Product ID', minimum: 0 })
  @Min(0)
  @IsCustomNumber()
  productId: IProduct;

  @ApiProperty({ example: '갯수', minimum: 1 })
  @Min(1)
  @IsCustomNumber()
  count: ICount;

  @ApiProperty({ example: 'Product Money', minimum: 0 })
  @Min(0)
  @IsCustomNumber()
  amount: IMoney;
  @ApiProperty({ example: 'Order ID', minimum: 0 })
  @Min(0)
  @IsCustomNumber()
  orderId: IOrderPK;
}
