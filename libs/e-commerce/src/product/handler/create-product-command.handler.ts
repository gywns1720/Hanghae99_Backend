import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from '@lib/e-commerce/product/command/create-product.command';
import { ProductRepository } from '@lib/e-commerce/mysql/repository';
import { ProductDomain } from '@lib/e-commerce/product/domain';

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(protected readonly repo: ProductRepository) {}
  async execute(command: CreateProductCommand): Promise<any> {
    await this.repo.createItem(
      command.products.map(
        (product) => ProductDomain.fromDomainToEntity(product),
        command.runner,
      ),
    );
  }
}
