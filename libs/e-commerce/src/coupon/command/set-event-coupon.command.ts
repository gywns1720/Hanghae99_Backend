import { ICommand } from '@nestjs/cqrs';

/**
 * @summary 이벤트 쿠폰 발행
 */
export class SetEventCouponCommand implements ICommand {
  constructor(
    // 쿠폰 아이디
    readonly couponId: number,
    // 이벤트 진행할 쿠폰
    readonly stock: number,
    // 유효기간 (분 단위)
    readonly expiresMinutes: number = 60,
    // 발행할때 추가인가 초기화 인가
    readonly status: 'init' | 'add' = 'init',
  ) {}
}
