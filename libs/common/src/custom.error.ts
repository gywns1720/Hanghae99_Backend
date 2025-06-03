import { HttpStatus } from '@nestjs/common';

/**
 * @summary 커스텀 마이징 에러
 */
export abstract class CustomError {
  /**
   * @summary 메세지
   * @protected
   */
  protected message: string;
  /**
   * @summary 에러코드
   * @protected
   */
  protected errorCode: number;

  /**
   * @summary HTTP 상태값
   * @protected
   */
  protected httpStatus: HttpStatus;

  protected constructor(
    message: string,
    code: number,
    httpStatus: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    this.message = message;
    this.errorCode = code;
    this.httpStatus = httpStatus;
  }

  get toObject() {
    return {
      status: this.httpStatus,
      errorCode: this.errorCode,
      message: this.message,
    };
  }
}
