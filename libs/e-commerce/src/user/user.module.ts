import { Module } from '@nestjs/common';
import { IdPasswordStrategy } from '@lib/e-commerce/user/strategy/id-password.strategy';
import { IAuthStrategy } from '@lib/e-commerce/user/i-auth';
import { AuthStrategyContext } from '@lib/e-commerce/user/context/auth-strategy.context';
import { UserCqrsModule } from '@lib/e-commerce/user/user-cqrs.module';
const strategyProviders = [IdPasswordStrategy];
/**
 * @Module
 */
@Module({
  imports: [UserCqrsModule],
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
