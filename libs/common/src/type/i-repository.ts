import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  QueryRunner,
} from 'typeorm';
import { INull } from '@lib/common/type/i-null-undefined';

/**
 * @summary 리포지토리 인터페이스
 * @extends {IFindOneItem | ICreateItems | IDeleteItem | IUpdateItem}
 */
export interface IRepository<T extends ObjectLiteral>
  extends IFindOneItem<T>,
    ICreateItems<T>,
    IDeleteItem<T>,
    IUpdateItem<T> {}

/**
 * @summary 단일 검색 아이템 인터페이스
 */
export interface IFindOneItem<T extends ObjectLiteral> {
  /**
   * @summary PK 를 이용한 검색
   * @param id {string} 아이디
   */
  findOneItem(id: string): Promise<INull<T>>;
}
/**
 * @summary 아이템 생성 인터페이스
 */
export interface ICreateItems<T extends ObjectLiteral> {
  /**
   * @summary 데이터 저장
   * @param entities {ObjectLiteral[]} 저장할 엔티티 리스트
   */
  createItems(...entities: T[]): Promise<void>;
}

/**
 * @summary 삭제 인터페이스
 */
export interface IDeleteItem<T extends ObjectLiteral> {
  /**
   * @summary 데이터 삭제
   * @param id {string} 데이터 아이디
   */
  deleteItem(id: string): Promise<void>;
}

export interface IUpdateItem<T extends ObjectLiteral> {
  /**
   * @summary 데이터 업데이트
   * @param id {string} 아이디
   * @param item {Partial<ObjectLiteral>} 업데이트할 아이템
   */
  updateItem(id: string, item: Partial<T>): Promise<void>;
}
export interface IFindManyItem<T extends ObjectLiteral> {
  findManyItems(
    options: FindManyOptions<T> & { runner?: QueryRunner },
  ): Promise<T[]>;
}

export interface IFindTotal<T extends ObjectLiteral> {
  total(options: FindOneOptions<T>): Promise<number>;
}

export interface ITransaction {
  transaction: (
    callback: (manager: EntityManager) => Promise<void>,
  ) => Promise<void>;
}
