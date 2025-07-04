import { IssueCouponCommandHandler } from '@lib/e-commerce/coupon/handler/issue-coupon-command.handler';
import { IssueCouponCommand } from '@lib/e-commerce/coupon/command/issue-coupon.command';
import { IRedis } from '@lib/common/type';
import ProviderConst from '@lib/common/const/provider.const';

describe('IssueCouponCommandHandler', () => {
  let handler: IssueCouponCommandHandler;
  let redisMock: jest.Mocked<IRedis>;

  const COUPON_ID = 1;
  const USER_ID = 3;

  beforeEach(() => {
    redisMock = {
      eval: jest.fn(),
    } as any;

    handler = new IssueCouponCommandHandler(redisMock);
  });

  it('쿠폰 발급에 성공하면 success를 반환해야 한다', async () => {
    redisMock.eval.mockResolvedValue(1);

    const command = new IssueCouponCommand(COUPON_ID, USER_ID);
    const result = await handler.execute(command);

    expect(result.status).toBe('success');
    expect(redisMock.eval).toHaveBeenCalledWith(
      expect.stringContaining('SISMEMBER'),
      2,
      ProviderConst.RedisKey.Coupon.Stock(COUPON_ID),
      ProviderConst.RedisKey.Coupon.Claimed(COUPON_ID),
      USER_ID,
    );
  });

  it('이미 쿠폰을 받은 사용자라면 duplicate를 반환해야 한다', async () => {
    redisMock.eval.mockResolvedValue(0);

    const command = new IssueCouponCommand(COUPON_ID, USER_ID);
    const result = await handler.execute(command);

    expect(result.status).toBe('duplicate');
  });

  it('재고가 0 이하라면 soldout을 반환해야 한다', async () => {
    redisMock.eval.mockResolvedValue(-1);

    const command = new IssueCouponCommand(COUPON_ID, USER_ID);
    const result = await handler.execute(command);

    expect(result.status).toBe('soldout');
  });

  it('예상하지 못한 Redis 결과가 오면 error를 반환해야 한다', async () => {
    redisMock.eval.mockResolvedValue('invalid');

    const command = new IssueCouponCommand(COUPON_ID, USER_ID);
    const result = await handler.execute(command);

    expect(result.status).toBe('error');
  });

  it('Redis에서 예외가 발생하면 error를 반환해야 한다', async () => {
    redisMock.eval.mockRejectedValue(new Error('Redis error'));

    const command = new IssueCouponCommand(COUPON_ID, USER_ID);
    const result = await handler.execute(command);

    expect(result.status).toBe('error');
  });
});
