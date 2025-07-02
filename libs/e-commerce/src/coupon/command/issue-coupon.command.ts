import { ICommand } from '@nestjs/cqrs';
import { QueryRunner } from 'typeorm';
import { ICouponStatus } from '@lib/e-commerce/coupon/i-coupon';

/**
 * @summary 쿠폰 발행 커맨드
 * @implements ICommand 커맨드 명령어
 * @class
 */
export class IssueCouponCommand implements ICommand {
  constructor(
    readonly couponId: number,
    readonly userId: number,
    readonly runner?: QueryRunner,
  ) {}
}

export class IssueCouponCommandResponse {
  constructor(readonly status: ICouponStatus) {}
}
