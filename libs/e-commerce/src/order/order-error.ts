import { HttpStatus } from '@nestjs/common';
import { CustomError } from '@lib/common';

/**
 * @Error
 */
export class OrderError extends CustomError {
  constructor(
    message: string,
    errorCode: number,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(message, errorCode, status);
  }

  /**
   * @summary 장바구니 비어있습니다. 에러
   * @constructor
   */
  static BasketEmpty() {
    return new OrderError('Basket Empty', 401);
  }

  /**
   * @summary 주문 실패
   * @constructor
   */
  static FailedOrder() {
    return new OrderError('Failed Order', 402);
  }

  /**
   * @summary 제품 아이디가 비어있습니다.
   * @constructor
   */
  static ProductIDEmpty() {
    return new OrderError('Empty Product ID', 403);
  }

  /**
   * @summary 제품 아이디를 찾을 수 없습니다.
   * @constructor
   */
  static NotFoundProduct() {
    return new OrderError('Not Found Product', 404);
  }
}
