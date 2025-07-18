import { Inject, Injectable } from '@nestjs/common';
import ProviderConst from '@lib/common/const/provider.const';
import { IRedis } from '@lib/common/type';
import { DateUtils } from '@lib/common/utils';
import Redis from 'ioredis';

/**
 * @Service
 */
@Injectable()
export class UserLockProvider {
  constructor(@Inject(ProviderConst.Redis) protected readonly redis: Redis) {}

  async checkLock(id: string, lockValue: string): Promise<boolean> {
    const lockKey = ProviderConst.RedisKey.User.LockKey(id);
    const result = await this.redis.set(
      lockKey,
      lockValue,
      'EX', // TTL 단위: 초(seconds)
      300, // TTL 값
      'NX',
    ); // 300초 = 5분

    return result === 'OK';
  }

  /**
   * @summary 수동 락 해제
   * @param id
   * @param lockValue
   */
  async releaseLock(id: string, lockValue: string): Promise<void> {
    const lockKey = ProviderConst.RedisKey.User.LockKey(id);
    const currentValue = await this.redis.get(lockKey);
    if (currentValue === lockValue) {
      await this.redis.del(lockKey);
    }
  }

  async hasLockUserId(id: string): Promise<boolean> {
    const lockKey = ProviderConst.RedisKey.User.LockKey(id);
    const exists = await this.redis.exists(lockKey);
    return exists === 1;
  }

  async deleteLock(id: string, maxRetry = 2) {
    const lockKey = ProviderConst.RedisKey.User.LockKey(id);
    let attempt = 0;

    while (attempt <= maxRetry) {
      try {
        await this.redis.del(lockKey);
        return; // 성공 시 종료
      } catch (err) {
        attempt++;
        if (attempt > maxRetry) {
          console.warn(
            `[Lock] Failed to delete lock after ${attempt} attempts for id=${id}`,
            err,
          );
          return; // 실패하더라도 그냥 로그만 남기고 흐름 유지
        }

        // 잠깐 쉬고 다시 시도 (exponential backoff도 가능)
        await new Promise((res) => setTimeout(res, 100));
      }
    }
  }
}
