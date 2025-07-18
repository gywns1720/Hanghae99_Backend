export type ICouponStatus =
  | ICouponSuccessStatus
  | ICouponDuplicateStatus
  | ICouponSoldOutStatus
  | ICouponErrorStatus;
/**
 * @summary 성공적으로 쿠폰을 받음
 */
export type ICouponSuccessStatus = 'success';

/**
 * @summary 쿠폰 중복
 */
export type ICouponDuplicateStatus = 'duplicate';

/**
 * @summary 쿠폰 매진
 */
export type ICouponSoldOutStatus = 'soldout';
/**
 * @summary 쿠폰 에러
 */
export type ICouponErrorStatus = 'error';
