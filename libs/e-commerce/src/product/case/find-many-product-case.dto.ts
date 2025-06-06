import { IMoney, INull, IPageAndQueryRunner } from '@lib/common/type';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * @dto FindManyProductCaseDto
 * @version v1
 */
export class FindManyProductCaseDto
  implements Pick<IPageAndQueryRunner, 'page'>
{
  @IsString()
  @IsOptional()
  name?: INull<string>;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  stock?: INull<IMoney>;

  @Type(() => Number)
  @IsNumber()
  page: number;
}
