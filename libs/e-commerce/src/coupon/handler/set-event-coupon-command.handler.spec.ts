import { SetEventCouponCommandHandler } from './set-event-coupon-command.handler';
import { IRedis } from '@lib/common/type';
import ProviderConst from '@lib/common/const/provider.const';
import { SetEventCouponCommand } from '@lib/e-commerce/coupon/command/set-event-coupon.command';

describe('SetEventCouponCommandHandler', () => {
  let handler: SetEventCouponCommandHandler;
  let redisMock: jest.Mocked<IRedis>;

  const COUPON_ID = 123;
  const REDIS_KEY = ProviderConst.RedisKey.Coupon.Stock(COUPON_ID);

  beforeEach(() => {
    redisMock = {
      set: jest.fn(),
      get: jest.fn(),
      ttl: jest.fn(),
    } as any;

    handler = new SetEventCouponCommandHandler(redisMock);
  });

  it('init 상태일 때 redis에 초기값과 TTL을 설정해야 한다', async () => {
    const command = new SetEventCouponCommand(COUPON_ID, 100, 10, 'init');

    await handler.execute(command);

    expect(redisMock.set).toHaveBeenCalledWith(REDIS_KEY, 100, 'EX', 10 * 60);
  });

  it('add 상태일 때 기존 재고에 stock을 더해 TTL 유지하며 갱신해야 한다', async () => {
    redisMock.get.mockResolvedValue('30');
    redisMock.ttl.mockResolvedValue(120);

    const command = new SetEventCouponCommand(COUPON_ID, 20, 30, 'add');

    await handler.execute(command);

    expect(redisMock.set).toHaveBeenCalledWith(
      REDIS_KEY,
      50, // 30 + 20
      'EX',
      120,
    );
  });

  it('add 상태인데 TTL이 없으면 기본 TTL로 설정해야 한다', async () => {
    redisMock.get.mockResolvedValue('10');
    redisMock.ttl.mockResolvedValue(-1); // TTL 없음

    const command = new SetEventCouponCommand(COUPON_ID, 5, 3, 'add');

    await handler.execute(command);

    expect(redisMock.set).toHaveBeenCalledWith(REDIS_KEY, 15, 'EX', 3 * 60);
  });

  it('add 상태인데 기존 stock이 숫자가 아니면 0으로 간주하고 더해야 한다', async () => {
    redisMock.get.mockResolvedValue('not-a-number');
    redisMock.ttl.mockResolvedValue(100);

    const command = new SetEventCouponCommand(COUPON_ID, 25, 5, 'add');

    await handler.execute(command);

    expect(redisMock.set).toHaveBeenCalledWith(REDIS_KEY, 25, 'EX', 100);
  });

  it('stock 값이 음수거나 너무 크면 clamp를 적용해야 한다', async () => {
    redisMock.get.mockResolvedValue('10000'); // 너무 큼
    redisMock.ttl.mockResolvedValue(200);

    const command = new SetEventCouponCommand(COUPON_ID, 1, 5, 'add');

    await handler.execute(command);

    // clamp(10000, 0, 9999) = 9999 + 1 = 10000
    expect(redisMock.set).toHaveBeenCalledWith(REDIS_KEY, 10000, 'EX', 200);
  });
});
