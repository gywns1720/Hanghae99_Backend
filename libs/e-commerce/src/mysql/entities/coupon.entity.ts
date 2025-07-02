import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('coupon')
export class CouponEntity {
  // 쿠폰 ID
  @PrimaryGeneratedColumn()
  id: number;

  // 이름
  @Column({ type: 'varchar', length: 100 })
  name: string;

  // 할인가
  @Column({ type: 'int', default: 1000 })
  discount: number;
}
