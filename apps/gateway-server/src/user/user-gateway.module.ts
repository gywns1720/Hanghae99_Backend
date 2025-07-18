import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserSignController } from './sign/user-sign.controller';
import { KafkaModule } from '@app/kafka';
import KafkaConst from '@app/kafka/kafka.const';
import { HttpModule } from '@nestjs/axios';

/**
 * @Module
 */
@Module({
  imports: [KafkaModule.registry(KafkaConst.Groups.User.Id), HttpModule],
  controllers: [UserController, UserSignController],
})
export class UserGatewayModule {}
