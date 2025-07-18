import { IEvent } from '@nestjs/cqrs';
import { ProductEntity } from '@lib/e-commerce/mysql/entities';

export class ProductsValidatedEvent implements IEvent {
  constructor(
    public readonly orderId: string,
    public readonly productMap: Map<number, ProductEntity>,
  ) {}
}
