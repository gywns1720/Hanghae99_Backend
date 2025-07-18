import { Injectable } from '@nestjs/common';

@Injectable()
export class LogServerService {
  getHello(): string {
    return 'Hello World!';
  }
}
