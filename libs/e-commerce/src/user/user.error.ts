import { CustomError } from '@lib/common';
import { HttpStatus } from '@nestjs/common';

/**
 * @summary 유저 에러
 */
export class UserError extends CustomError {
  constructor(
    message: string,
    errorCode: number,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(message, errorCode, status);
  }

  //#region [찾을 수 없는 에러]
  static NotFoundUser() {
    return new UserError('NotFound User', 401);
  }

  static LackOfPoint() {
    return new UserError('Lack Of Point', 402);
  }
  //#endregion
}
