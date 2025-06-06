import Domain from '@lib/common/abstract/domain.abstract';
import type { IDateString, IMoney, IPrimaryKey } from '@lib/common/type';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { IOrderStatus } from '@lib/e-commerce/order/interface/i-order-status';
import { IsCustomNumber } from '@lib/common/decorator';

/**
 * @domain
 */
export class OrderDomain extends Domain {
  @IsString()
  id: IPrimaryKey;

  @IsString()
  userId: IPrimaryKey;

  @IsCustomNumber()
  totalPrice: IMoney;

  @IsCustomNumber()
  finalPrice: IMoney;

  @Type(() => Number)
  @IsNumber()
  status: IOrderStatus;
  @Type(() => Date)
  @IsDateString()
  @IsOptional()
  createdAt: IDateString;

  @IsCustomNumber()
  indate: number;
}
