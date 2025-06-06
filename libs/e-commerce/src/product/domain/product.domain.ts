import type { IDateString, IPrimaryKey, INull, ICount } from '@lib/common/type';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import Domain from '@lib/common/abstract/domain.abstract';
import { Type } from 'class-transformer';
import { IsCustomNumber } from '@lib/common/decorator';

/**
 * @summary 제품 도메인
 */
export class ProductDomain extends Domain {
  @IsString()
  id: IPrimaryKey;
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  desc: INull<string>;
  @Type(() => Date)
  @IsDateString()
  @IsOptional()
  createdAt: IDateString;
  @IsString()
  thumbnail: IPrimaryKey;
  @Type(() => Date)
  @IsDateString()
  @IsOptional()
  updatedAt: INull<IDateString>;
  @IsCustomNumber()
  stock: ICount;
}
