import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderServerService {
  getHello(): string {
    return 'Hello World!';
  }
}
