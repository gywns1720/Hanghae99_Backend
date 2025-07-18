import { ICommand } from '@nestjs/cqrs';
import { ProductDomain } from '@lib/e-commerce/product/domain';
import { QueryRunner } from 'typeorm';

export class CreateProductCommand implements ICommand {
  constructor(
    readonly products: ProductDomain[],
    readonly runner?: QueryRunner,
  ) {}
}
