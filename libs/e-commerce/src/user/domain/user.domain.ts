import { IsOptional, IsString, ValidateNested } from 'class-validator';
import Domain from '@lib/common/abstract/domain.abstract';
import { IPrimaryKey } from '@lib/common/type';
import { UserProfileDomain } from '@lib/e-commerce/user/domain/user-profile.domain';
import { Type } from 'class-transformer';

/**
 * @domain
 */
export class UserDomain extends Domain {
  @IsString()
  id: IPrimaryKey;

  @Type(() => UserProfileDomain)
  @ValidateNested({ each: true })
  @IsOptional()
  profile: UserProfileDomain | null;
}
