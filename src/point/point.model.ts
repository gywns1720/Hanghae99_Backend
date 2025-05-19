export type UserPoint = {
  id: number;
  point: number;
  updateMillis: number;
};

/**
 * 포인트 트랜잭션 종류
 * - CHARGE : 충전
 * - USE : 사용
 */
export enum TransactionType {
  CHARGE,
  USE,
}

export type PointHistory = {
  id: number;
  userId: number;
  type: TransactionType;
  amount: number;
  timeMillis: number;
};

//#region [Interface Update 2025-05-19]
/**
 * @summary 유저 아이디
 */
export type IUserID = string | number;

/**
 * @summary 유저 아이디 + null + undefined
 */
export type IUserIDWithEmpty = IUserID | null | undefined;
//#endregion
