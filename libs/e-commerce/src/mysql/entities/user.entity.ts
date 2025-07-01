import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IMoney } from '@lib/common/type';
import { IUserPK } from '@lib/e-commerce/user/i-user';

/**
 * @Entity 유저 리뉴얼
 */
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: IUserPK;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'integer', default: 0 })
  point: IMoney;
}
