import { ILimitOptions } from '@lib/common/type';

/**
 * @summary 옵션 정보
 */
/**
 * @summary Limit Size 쿼리 추가
 */
export class FindManyLimitSizeQuery {
  constructor(public readonly options: ILimitOptions) {}
}
