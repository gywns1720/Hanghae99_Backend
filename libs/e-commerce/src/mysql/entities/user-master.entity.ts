import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { IDateString, IPrimaryKey } from '@lib/common/type';
import { UserProfileEntity } from '@lib/e-commerce/mysql/entities/user-profile.entity';

/**
 * @Entity
 */
@Entity('user_master')
export class UserMasterEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  u_id: IPrimaryKey;
  auth: number;
  is_blacklist: boolean;
  is_cookie_approval: boolean;
  is_personal_information: boolean;
  approval_information: boolean;
  created_at: IDateString;
  login_at: IDateString | null;
  logout_at: IDateString | null;

  @OneToOne(() => UserProfileEntity, (profile) => profile.masterInfo, {
    cascade: true,
  })
  @JoinColumn()
  profile: UserProfileEntity;
}
