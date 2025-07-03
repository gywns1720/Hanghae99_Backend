import { Module } from '@nestjs/common';
import { UserLockProvider } from '@lib/e-commerce/user/provider/user-lock.provider';

/**
 * @Module
 */
@Module({
  providers: [UserLockProvider],
  exports: [UserLockProvider],
})
export class UserProviderModule {}
