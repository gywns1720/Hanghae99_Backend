import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ICount, IPrimaryKey } from '@lib/common/type';
import { IProduct } from '@lib/e-commerce/product/i-product';
import { IOrderPK } from '@lib/e-commerce/order/i-order';
import { OrderEntity } from '@lib/e-commerce/mysql/entities/order.entity';

/**
 * @Entity 장바구니 (Order 1 : Basket N)
 */
@Entity('basket')
export class BasketEntity {
  @PrimaryGeneratedColumn()
  id: IPrimaryKey;

  @Column({ type: 'int', comment: '제품 고유 아이디' })
  product_id: IProduct;

  @Column({ type: 'int', default: 1 })
  amount: ICount;

  @Column({ type: 'int' })
  order_id: IOrderPK;

  @ManyToOne(() => OrderEntity, (item) => item.basketList, {
    cascade: false,
  })
  @JoinColumn({
    name: 'order_id',
  })
  orderInfo: OrderEntity;
}
