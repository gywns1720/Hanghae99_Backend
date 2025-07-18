import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { IPrimaryKey } from '@lib/common/type';

/**
 * @domain
 */
export class UserHelperDomain {
  @ApiProperty({ maxLength: 36, minLength: 2 })
  @MinLength(2)
  @MaxLength(36)
  @IsString()
  id: IPrimaryKey;
}
