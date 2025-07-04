import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IMoney } from '@lib/common/type';
import { IUserPK } from '@lib/e-commerce/user/i-user';
import { Type } from 'class-transformer';
import * as Joi from 'joi';
import { IsCustomNumber } from '@lib/common/decorator';
/**
 * @domain
 */
export class UserDomain {
  @ApiProperty({ example: '고유 PK' })
  @IsString()
  __pk: IUserPK;

  @ApiProperty({ example: '유저 아이디' })
  @IsString()
  id: string;
  @ApiProperty({ example: '유저 아이디' })
  @IsString()
  pw: string;

  @ApiProperty({ example: '이름' })
  @IsString()
  name: string;

  @ApiProperty({ example: '포인트', default: 0 })
  @IsCustomNumber()
  point: IMoney;

  static schema() {
    return Joi.object({
      __pk: Joi.number().min(0).required(),
      id: Joi.string().max(50).required(),
      pw: Joi.string().max(512).required(),
      name: Joi.string().max(100).required(),
      point: Joi.number().min(0).required(),
    });
  }
}
