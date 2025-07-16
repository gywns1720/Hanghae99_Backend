import { Module } from '@nestjs/common';
import { LogServerController } from './log-server.controller';
import { LogServerService } from './log-server.service';

@Module({
  imports: [],
  controllers: [LogServerController],
  providers: [LogServerService],
})
export class LogServerModule {}
