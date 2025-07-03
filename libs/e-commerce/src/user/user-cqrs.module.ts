import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import UserCQRSHandlers from '@lib/e-commerce/user/handler';

/**
 * @Module
 */
@Module({
  imports: [CqrsModule],
  providers: [...UserCQRSHandlers],
  exports: [CqrsModule, ...UserCQRSHandlers],
})
export class UserCqrsModule {}
