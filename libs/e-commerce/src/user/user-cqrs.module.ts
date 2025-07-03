import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import UserCQRSHandlers from '@lib/e-commerce/user/handler';
import UserValidatorPlugins from '@lib/e-commerce/user/validator-plugins';
import { IValidatorPlugin } from '@lib/e-commerce/user/validator-plugins/i-validator-plugin';
import { UserProviderModule } from '@lib/e-commerce/user/user-provider.module';

/**
 * @Module
 */
@Module({
  imports: [CqrsModule, UserProviderModule],
  providers: [
    ...UserValidatorPlugins.Plugins,
    {
      provide: UserValidatorPlugins.Inject,
      useFactory: (...plugins: IValidatorPlugin[]) => plugins,
      inject: [...UserValidatorPlugins.Plugins],
    },
    ...UserCQRSHandlers,
  ],
  exports: [CqrsModule, UserValidatorPlugins.Inject, ...UserCQRSHandlers],
})
export class UserCqrsModule {}
