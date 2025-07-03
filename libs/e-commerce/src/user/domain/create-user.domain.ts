import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserDomain } from '@lib/e-commerce/user/domain/user.domain';
import { Type } from 'class-transformer';
import { IMoney } from '@lib/common/type';
import { IsOptional } from 'class-validator';

/**
 * @domain
 */
export class CreateUserDomain extends OmitType(UserDomain, [
  '__pk',
  'point',
] as const) {
  @ApiProperty({
    example: '시작 포인트',
    default: 0,
    nullable: true,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  point?: IMoney | null;
}
