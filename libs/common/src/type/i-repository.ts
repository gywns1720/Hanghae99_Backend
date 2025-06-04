import type { ObjectLiteral } from 'typeorm';

export interface IRepository<T extends ObjectLiteral> {
  /**
   * @summary PK 를 이용한 검색
   * @param id {string} 아이디
   */
  findOneItem(id: string): Promise<T | null>;

  /**
   * @summary 데이터 저장
   * @param entities {ObjectLiteral[]} 저장할 엔티티 리스트
   */
  createItems(...entities: T[]): Promise<void>;

  /**
   * @summary 데이터 삭제
   * @param id {string} 데이터 아이디
   */
  deleteItem(id: string): Promise<void>;

  /**
   * @summary 데이터 업데이트
   * @param id {string} 아이디
   * @param item {Partial<ObjectLiteral>} 업데이트할 아이템
   */
  updateItem(id: string, item: Partial<T>): Promise<void>;
}
