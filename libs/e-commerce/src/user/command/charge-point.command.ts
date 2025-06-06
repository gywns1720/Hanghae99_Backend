import { PointDomain, UserProfileDomain } from '@lib/e-commerce/user/domain';

/**
 * @summary 포인트 충전
 */
export class ChargePointCommand {
  constructor(
    readonly userProfile: UserProfileDomain,
    readonly domain: PointDomain,
  ) {}
}
