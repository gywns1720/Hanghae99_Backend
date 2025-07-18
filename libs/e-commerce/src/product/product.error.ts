import { CustomError } from '@lib/common';
import { HttpStatus } from '@nestjs/common';

/**
 * @summary 상품 에러
 */
export class ProductError extends CustomError {
  constructor(
    message: string,
    errorCode: number,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(message, errorCode, status);
  }

  //#region [상품 생성 에러]

  /**
   * @summary 이미 생성된 제품
   *
   * @constructor
   */
  static AlreadyCreateProduct() {
    return new ProductError('Already Create Product ID', 401);
  }

  /**
   * @summary 검색에 문제가 발생된 제품
   * @constructor
   */
  static SearchErrorProduct() {
    return new ProductError('Search Error Product', 402);
  }
  /**
   * @summary 유저를 찾을 수 없습니다.
   *
   * @constructor
   */
  static NotFoundUser() {
    return new ProductError('NotFoundUser', 403);
  }
  //#endregion
}
