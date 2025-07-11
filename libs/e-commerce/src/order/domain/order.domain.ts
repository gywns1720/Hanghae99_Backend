import { IOrder, IOrderPK } from '@lib/e-commerce/order/i-order';
import { ApiProperty } from '@nestjs/swagger';
import { IUserPK } from '@lib/e-commerce/user/i-user';
import { IsCustomNumber } from '@lib/common/decorator';

/**
 * @domain
 */
export class OrderDomain implements IOrder {
  @ApiProperty()
  @IsCustomNumber()
  id: IOrderPK;
  @ApiProperty()
  @IsCustomNumber()
  userId: IUserPK;
}
