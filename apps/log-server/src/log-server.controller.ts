import { Controller, Get } from '@nestjs/common';
import { LogServerService } from './log-server.service';

@Controller()
export class LogServerController {
  constructor(private readonly logServerService: LogServerService) {}

  @Get()
  getHello(): string {
    return this.logServerService.getHello();
  }
}
