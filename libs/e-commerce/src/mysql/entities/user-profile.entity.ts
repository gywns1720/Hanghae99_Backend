import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { IDateString, IMoney, IPrimaryKey } from '@lib/common/type';
import { UserMasterEntity } from '@lib/e-commerce/mysql/entities/user-master.entity';

/**
 * @Entity
 */
@Entity('user_profile')
export class UserProfileEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  u_id: IPrimaryKey;
  name: string;
  email: string;
  jit_code: string | null;
  birth_date: IDateString | null;
  @Column({ type: 'int', default: 0 })
  point: IMoney;

  @OneToOne(() => UserMasterEntity, (user) => user.profile)
  masterInfo: UserMasterEntity;
}
