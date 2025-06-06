import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from '@lib/e-commerce/product/command/create-product.command';
import { ICreateProductResponse } from '@lib/e-commerce/product/interface';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  /**
   * TODO CreateProduct 비즈니스 로직 구현하기
   * @param command {CreateProductCommand} 사용중인 커맨드
   */
  async execute(
    command: CreateProductCommand,
  ): Promise<ICreateProductResponse> {
    return { productId: '' };
  }
}
