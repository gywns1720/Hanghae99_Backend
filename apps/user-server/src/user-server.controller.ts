import { Controller, Get } from '@nestjs/common';
import { UserServerService } from './user-server.service';

@Controller()
export class UserServerController {
  constructor(private readonly userServerService: UserServerService) {}

  @Get()
  getHello(): string {
    return this.userServerService.getHello();
  }
}
