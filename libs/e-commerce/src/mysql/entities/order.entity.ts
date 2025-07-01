import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IUserPK } from '@lib/e-commerce/user/i-user';
import { IOrderPK } from '@lib/e-commerce/order/i-order';
import { BasketEntity } from '@lib/e-commerce/mysql/entities/basket.entity';

/**
 * @Entity 주문
 */
@Entity('order')
export class OrderEntity {
  // PK
  @PrimaryGeneratedColumn()
  id: IOrderPK;

  @Column({ type: 'int' })
  user_id: IUserPK;

  @OneToMany(() => BasketEntity, (item) => item.orderInfo, { cascade: false })
  basketList: BasketEntity[];
}
