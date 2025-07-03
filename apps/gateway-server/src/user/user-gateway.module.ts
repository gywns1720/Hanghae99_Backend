import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserSignController } from './sign/user-sign.controller';

/**
 * @Module
 */
@Module({
  controllers: [UserController, UserSignController],
})
export class UserGatewayModule {}
