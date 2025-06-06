import { IsCustomNumber } from '@lib/common/decorator';
import { IsString } from 'class-validator';
import { IPrimaryKey } from '@lib/common/type';

export class CommonPointCaseDto {
  @IsCustomNumber()
  amount: number;
  @IsString()
  id: IPrimaryKey;
}
