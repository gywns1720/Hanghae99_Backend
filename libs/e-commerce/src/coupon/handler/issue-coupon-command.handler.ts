import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  IssueCouponCommand,
  IssueCouponCommandResponse,
} from '@lib/e-commerce/coupon/command/issue-coupon.command';
import { IRedis } from '@lib/common/type';
import { Inject } from '@nestjs/common';
import ProviderConst from '@lib/common/const/provider.const';

@CommandHandler(IssueCouponCommand)
export class IssueCouponCommandHandler
  implements ICommandHandler<IssueCouponCommand, IssueCouponCommandResponse>
{
  constructor(@Inject(ProviderConst.Redis) private readonly redis: IRedis) {}
  async execute(
    command: IssueCouponCommand,
  ): Promise<IssueCouponCommandResponse> {
    // issuance-of-coupons.lua
    const stockKey = ProviderConst.RedisKey.Coupon.Stock(command.couponId);
    const claimedKey = ProviderConst.RedisKey.Coupon.Claimed(command.couponId);

    // 루아스크립트 작성
    const result = await this.redis.eval(
      `
      if redis.call('SISMEMBER', KEYS[2], ARGV[1]) == 1 then return 0 end
      local stock = redis.call('GET', KEYS[1])
      if tonumber(stock) <= 0 then return -1 end
      redis.call('DECR', KEYS[1])
      redis.call('SADD', KEYS[2], ARGV[1])
      return 1
    `,
      2,
      stockKey,
      claimedKey,
      command.userId.toString(),
    );

    const resultInt =
      typeof result === 'string'
        ? parseInt(result)
        : typeof result === 'number'
          ? result
          : -2;

    if (isNaN(resultInt) || resultInt === -2) {
      return new IssueCouponCommandResponse('error');
    } else if (resultInt === 1) {
      return new IssueCouponCommandResponse('success');
    } else if (resultInt === 0) {
      return new IssueCouponCommandResponse('duplicate');
    } else if (resultInt === -1) {
      return new IssueCouponCommandResponse('soldout');
    } else {
      return new IssueCouponCommandResponse('error');
    }
  }
}
