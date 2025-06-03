/**
 * @summary 리미트 옵션
 */
export type ILimitOptions = ILimitAndQueryRunner | IPageAndQueryRunner;

/**
 * @summary QueryRunner 인터페이스
 */
export interface IQueryRunner {
  // TODO typeorm 설치 후 QueryRunner 옵션 설정 (트랜잭션)
  runner?: any;
}

/**
 * @summary limit, offset 기반으로 검색
 * @extends IQueryRunner
 */
export interface ILimitAndQueryRunner extends IQueryRunner {
  // 이 인터페이스는 limit 라는 타입으로 구분합니다.
  type: 'limit';
  // 페이지 검색 갯수 리미트
  limit?: number;
  // 페이지 검색 Offset
  skip?: number;
}

/**
 * @summary 페이지 기반 검색
 * @extends IQueryRunner
 */
export interface IPageAndQueryRunner extends IQueryRunner {
  // 이 인터페이스는 page 라는 타입으로 구분합니다.
  type: 'page';
  // 페이지 기반으로 검색
  page?: number;
  // 한 페이지당 N 갯수 설정
  size?: number;
}
