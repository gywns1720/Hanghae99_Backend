import { Entity, PrimaryColumn } from 'typeorm';
import { IDateString, IMoney, INull, IPrimaryKey } from '@lib/common/type';

/**
 * @Entity
 */
@Entity('product')
export class ProductEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  p_id: IPrimaryKey;

  name: string;

  desc: INull<string>;

  created_at: IDateString;

  updated_at: INull<IDateString>;

  thumbnail_id: INull<IPrimaryKey>;

  stock: IMoney;
}
