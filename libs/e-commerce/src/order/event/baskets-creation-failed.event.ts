import { IEvent } from '@nestjs/cqrs';
import { OrderError } from '@lib/e-commerce/order/order-error';
import { CustomError } from '@lib/common';
import { HttpException } from '@nestjs/common';

export class BasketsCreationFailedEvent implements IEvent {
  constructor(
    public readonly orderId: string,
    public readonly error: Error | OrderError | CustomError | HttpException,
  ) {}
}
