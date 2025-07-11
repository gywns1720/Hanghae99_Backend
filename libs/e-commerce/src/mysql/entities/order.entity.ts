import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { IUserPK } from '@lib/e-commerce/user/i-user';
import { IOrderPK } from '@lib/e-commerce/order/i-order';
import { BasketEntity } from '@lib/e-commerce/mysql/entities/basket.entity';
import { OrderStatus } from '@lib/e-commerce/order/order-status.enum';

/**
 * @Entity 주문
 */
@Entity('order')
export class OrderEntity {
  // PK
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: IOrderPK;

  @Column({ type: 'int' })
  user_id: IUserPK;

  @Column({ type: 'varchar', length: 50, enum: OrderStatus })
  status: OrderStatus;

  @OneToMany(() => BasketEntity, (item) => item.orderInfo, { cascade: false })
  basketList?: BasketEntity[];
}
