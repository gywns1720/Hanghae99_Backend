import { PointDomain, UserProfileDomain } from '@lib/e-commerce/user/domain';

export class SubtractPointCommand {
  constructor(
    readonly userProfile: UserProfileDomain,
    readonly domain: PointDomain,
  ) {}
}
