import { Module } from '@nestjs/common';
import { UserServerService } from './user-server.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UserServerService],
})
export class UserServerModule {}
