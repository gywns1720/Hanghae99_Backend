import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserDomain } from '@lib/e-commerce/user/domain/user.domain';
import { IMoney } from '@lib/common/type';
import { IsOptional } from 'class-validator';
import { IsCustomNumber } from '@lib/common/decorator';

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
  @IsCustomNumber()
  @IsOptional()
  point?: IMoney | null;
}
