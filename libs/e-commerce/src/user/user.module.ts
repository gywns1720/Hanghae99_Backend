import { Module } from '@nestjs/common';
import { IdPasswordStrategy } from '@lib/e-commerce/user/strategy/id-password.strategy';
import { IAuthStrategy } from '@lib/e-commerce/user/i-auth';
import { AuthStrategyContext } from '@lib/e-commerce/user/context/auth-strategy.context';
const strategyProviders = [IdPasswordStrategy];
/**
 * @Module
 */
@Module({
  providers: [
    ...strategyProviders,
    {
      provide: 'AUTH_STRATEGIES',
      useFactory: (...strategies: IAuthStrategy[]) => strategies,
      inject: [...strategyProviders],
    },
    AuthStrategyContext,
  ],
  exports: [AuthStrategyContext],
})
export class UserModule {}
