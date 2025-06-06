import Domain from '@lib/common/abstract/domain.abstract';
import { IDateString, IMoney, INull, IPrimaryKey } from '@lib/common/type';
import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsCustomNumber } from '@lib/common/decorator';

/**
 * @domain
 */
export class UserProfileDomain extends Domain {
  @IsString()
  id: IPrimaryKey;
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @IsOptional()
  jitCode?: INull<string>;

  @Type(() => Date)
  @IsDateString()
  @IsOptional()
  birthDate?: INull<IDateString>;
  @IsCustomNumber()
  point: IMoney;
}
