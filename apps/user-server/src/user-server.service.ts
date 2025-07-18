import { Injectable } from '@nestjs/common';

@Injectable()
export class UserServerService {
  getHello(): string {
    return 'Hello World!';
  }
}
