import { IEvent } from '@nestjs/cqrs';

export class OrderCompensatedEvent implements IEvent {
  constructor(
    public readonly orderId: string,
    public readonly reason: string,
  ) {}
}
