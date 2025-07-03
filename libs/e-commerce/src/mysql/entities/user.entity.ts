import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IMoney } from '@lib/common/type';
import { IUserPK } from '@lib/e-commerce/user/i-user';

/**
 * @Entity 유저 리뉴얼 (간략하게 변경)
 */
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  user_pk: IUserPK;

  @Column({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 512 })
  pw: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'integer', default: 0 })
  point: IMoney;
}
