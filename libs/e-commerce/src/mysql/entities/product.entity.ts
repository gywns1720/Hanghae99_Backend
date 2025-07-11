import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ICount, IMoney } from '@lib/common/type';
import { IProduct } from '@lib/e-commerce/product/i-product';
import { BasketEntity } from '@lib/e-commerce/mysql/entities/basket.entity';

/**
 * @Entity 상품
 */
@Index('product_version_id_index', ['id', 'version'])
@Entity('product')
export class ProductEntity {
  // PK
  @PrimaryGeneratedColumn()
  id: IProduct;

  // 제목
  @Column({ type: 'varchar', length: 120 })
  title: string;

  // 재고량
  @Column({ type: 'int', default: 0 })
  amount: ICount;
  // 금액 (개당)
  @Column({ type: 'int', default: 0 })
  price: IMoney;
  @Column({ type: 'int', default: 0 })
  version: number;

  @OneToMany(() => BasketEntity, (item) => item.productInfo, { cascade: false })
  basketList?: BasketEntity[];
}
