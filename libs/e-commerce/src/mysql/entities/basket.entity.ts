import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ICount, IDateString, IMoney, IPrimaryKey } from '@lib/common/type';
import { IProduct } from '@lib/e-commerce/product/i-product';
import { IOrderPK } from '@lib/e-commerce/order/i-order';
import { OrderEntity } from '@lib/e-commerce/mysql/entities/order.entity';
import { ProductEntity } from '@lib/e-commerce/mysql/entities/product.entity';

/**
 * @Entity 장바구니 (Order 1 : Basket N)
 */
@Entity('basket')
export class BasketEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: IPrimaryKey;

  @Column({ type: 'int', comment: '제품 고유 아이디' })
  product_id: IProduct;

  @Column({ type: 'int', default: 1 })
  count: ICount;
  @Column({ type: 'int', default: 0 })
  amount: IMoney;

  @Column({ type: 'int' })
  order_id: IOrderPK;

  @Column({ type: 'datetime', nullable: false })
  created_at: IDateString;

  @ManyToOne(() => OrderEntity, (item) => item.basketList, {
    cascade: false,
  })
  @JoinColumn({
    name: 'order_id',
  })
  orderInfo?: OrderEntity;
  @ManyToOne(() => ProductEntity, (item: ProductEntity) => item.basketList, {
    cascade: false,
  })
  @JoinColumn({
    name: 'product_id',
  })
  productInfo?: ProductEntity;
}
