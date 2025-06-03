import type { IDateString, IPrimaryKey, ICount } from '@lib/common/type';

/**
 * @summary 제품 도메인
 */
export class ProductDomain {
  id: IPrimaryKey;
  name: string;
  desc: string | null;
  createdAt: IDateString;
  thumbnail: IPrimaryKey;
  updatedAt: IDateString | null;
  stock: ICount;
}
