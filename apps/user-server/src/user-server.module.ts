import { Module } from '@nestjs/common';
import { UserServerController } from './user-server.controller';
import { UserServerService } from './user-server.service';

@Module({
  imports: [],
  controllers: [UserServerController],
  providers: [UserServerService],
})
export class UserServerModule {}
