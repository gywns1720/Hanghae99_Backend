import { ICommand } from '@nestjs/cqrs';

/**
 * @summary 장바구니 업데이트 커맨드
 */
export class UpdateBucketCommand implements ICommand {
  constructor() {}
}
