import type { IDateString, IPrimaryKey, ICount } from '@lib/common/type';
import { IsOptional, IsString } from 'class-validator';

/**
 * @summary 제품 도메인
 */
export class ProductDomain {
  @IsString()
  id: IPrimaryKey;
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  desc: string | null;
  createdAt: IDateString;
  thumbnail: IPrimaryKey;
  updatedAt: IDateString | null;
  stock: ICount;
}
