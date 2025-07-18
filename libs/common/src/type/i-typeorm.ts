import { Brackets, ObjectLiteral, QueryRunner } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { InsertOrUpdateOptions } from 'typeorm/query-builder/InsertOrUpdateOptions';

export interface IWhereOption {
  where:
    | string
    | ((qb: any) => string)
    | Brackets
    | ObjectLiteral
    | ObjectLiteral[];
  parameters?: ObjectLiteral;
}
/**
 * Where 의 기본 타입
 * @author HJ
 * @version 0.0.1
 */
export interface IWhereDefault extends IWhereOption {
  type?: 'default';
}

/**
 * Where 조건문의 OR
 * @author HJ
 * @version 0.0.1
 *
 */
export interface IWhereOr extends IWhereOption {
  type: 'or';
}
/**
 * Where 조건문의 And
 * @author HJ
 * @version 0.0.1
 *
 */
export interface IWhereAnd extends IWhereOption {
  type: 'and';
}

/**
 * Where 타입
 * @author HJ
 * @version 0.0.1
 *
 */
export type IWhere = IWhereAnd | IWhereOr | IWhereDefault;

/**
 * Update 와 Insert 문을 합친 인터페이스
 */
export type IOrmUpsertOptions<E extends ObjectLiteral> =
  | IOrmUpsertUpdateOptions<E>
  | IOrmUpsertIgnoreOptions<E>;

export interface IOrmUpsertIgnoreOptions<E extends ObjectLiteral> {
  /**
   * 삽입할 테이터
   */
  values: QueryDeepPartialEntity<E> | QueryDeepPartialEntity<E>[];
  /**
   * 타입에 따른 SQL 동작방식이 다릅니다.
   * - ignore : 중복이 있는 경우 아무것도 하지 않습니다.
   */
  type: 'ignore';

  /**
   * ignore 시킬
   */
  statement?: string | boolean;
}

export interface IOrmUpsertUpdateOptions<E extends ObjectLiteral> {
  /**
   * 삽입할 테이터
   */
  values: QueryDeepPartialEntity<E> | QueryDeepPartialEntity<E>[];
  /**
   * 타입에 따른 SQL 동작방식이 다릅니다.
   * - update : 중복이 있는 경우 해당 레코드를 업데이트 시킵니다.
   *
   * @default update
   */
  type?: 'update';
  /**
   * 덮어쓸 엔티티 칼럼 키
   */
  overwirte: string | string[];

  /**
   * 삽입 & 업데이트 기준을 잡을 칼럼 키
   */
  target: string | string[];

  /**
   * Insert Or Update 관련된 옵션
   */
  config?: InsertOrUpdateOptions;
}
export interface IOrmCreateOptions {
  /**
   * 쿼리 러너
   * @type QueryRunner
   */
  queryRunner?: QueryRunner;

  /**
   * 생성할 칼럼 필터링
   *
   * undefined 인 경우 필터링을 안거친다.
   *
   *
   * @example```ts
   *  // 필터링이 A,B,C 만되어 있으므로 A,B,C 만 저장합니다.
   *  const data = [
   *      {
   *          '필터링 A' :  'A00001',
   *          '필터링 B' : 30,
   *          '필터링 C' : 'gsf',
   *          '필터링 D' : 'fasdfads',
   *          '필터링 E' : 543
   *      }
   *  ]
   *  return this.createQueryBuilder()
   *      .insert()
   *      .into(Entity, ['필터링 A','필터링 B','필터링 C'])
   *      .values(data)
   *      .orUpdate(['필터링 B', '필터링 C'], ['필터링 A'])
   *      .execute()
   * ```
   */
  columns?: string[];
}
