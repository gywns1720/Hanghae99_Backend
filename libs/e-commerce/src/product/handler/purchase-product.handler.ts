import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IPurchaseProductResponse } from '@lib/e-commerce/product/interface';
import { PurchaseProductCommand } from '@lib/e-commerce/product/command';
import { ProductRepository } from '@lib/e-commerce/mysql/repository/product.repository';

@CommandHandler(PurchaseProductCommand)
export class PurchaseProductHandler
  implements ICommandHandler<PurchaseProductCommand>
{
  constructor(private readonly productRepo: ProductRepository) {}
  /**
   * TODO CreateProduct 비즈니스 로직 구현하기
   * @param command {CreateProductCommand} 사용중인 커맨드
   */
  async execute(
    command: PurchaseProductCommand,
  ): Promise<IPurchaseProductResponse> {
    // 1. 제품 구매를 위한 재고량 체크 (동시성)

    return {};
  }
}
