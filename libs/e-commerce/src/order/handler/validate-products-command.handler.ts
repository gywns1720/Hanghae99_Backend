import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ValidateProductsCommand } from '@lib/e-commerce/order/command/validate-products.command';
import { ProductRepository } from '@lib/e-commerce/mysql/repository';
import { In } from 'typeorm';
import { OrderError } from '@lib/e-commerce/order/order-error';
import {
  ProductsValidatedEvent,
  ProductValidationFailedEvent,
} from '@lib/e-commerce/order/event';
import { ProductEntity } from '@lib/e-commerce/mysql/entities';
@CommandHandler(ValidateProductsCommand)
export class ValidateProductsCommandHandler
  implements ICommandHandler<ValidateProductsCommand>
{
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ValidateProductsCommand): Promise<void> {
    try {
      const { orderId, productIds } = command;

      if (productIds.length === 0) {
        this.__throwNotFoundProduct();
      }

      // 제품 조회
      const findProductList = await this.productRepo.findBy({
        id: In(productIds),
      });

      if (findProductList.length === 0) {
        this.__throwNotFoundProduct();
      }

      // 제품 매핑
      const productMap = new Map<number, ProductEntity>();
      for (const product of findProductList) {
        productMap.set(product.id, product);
      }

      // 모든 제품이 존재하는지 검증
      for (const productId of productIds) {
        if (!productMap.has(productId)) {
          this.__throwProductEmpty();
        }
      }

      // 제품 검증 완료 이벤트 발행
      this.eventBus.publish(new ProductsValidatedEvent(orderId, productMap));
    } catch (error) {
      // 제품 검증 실패 이벤트 발행
      this.eventBus.publish(
        new ProductValidationFailedEvent(command.orderId, error),
      );
    }
  }

  /**
   * @throws BadRequestException 아이디를 찾을 수 없습니다.
   * @private
   */
  private __throwNotFoundProduct(): never {
    throw OrderError.NotFoundProduct();
  }

  /**
   *
   * @throws OrderError 아이디 비어있음.
   * @private
   */
  private __throwProductEmpty(): never {
    throw OrderError.ProductIDEmpty();
  }
}
