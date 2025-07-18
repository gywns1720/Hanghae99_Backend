import { EventBus } from '@nestjs/cqrs';
import {
  CreateOrderCommand,
  ICreateOrderCommandRes,
} from '@lib/e-commerce/order/command/create-order.command';
import {
  // BasketRepository,
  OrderRepository,
} from '@lib/e-commerce/mysql/repository';
import { DateUtils, RandomUtils } from '@lib/common/utils';
import { OrderStatus } from '@lib/e-commerce/order/order-status.enum';
// import { BasketEntity, ProductEntity } from '@lib/e-commerce/mysql/entities';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { OrderError } from '@lib/e-commerce/order/order-error';
import { TypeORMError } from 'typeorm';
import { OrderCreatedEvent } from '@lib/e-commerce/order/event/order-created.event';
// import { plainToInstance } from 'class-transformer';
// import { BasketDomain } from '@lib/e-commerce/basket/domain/basket.domain';
@Injectable()
export class CreateOrderCommandHandler {
  // constructor(
  //   protected readonly eventBus: EventBus,
  //   protected readonly orderRepo: OrderRepository,
  //   protected readonly basketRepo: BasketRepository,
  // ) {}

  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: CreateOrderCommand,
  ): Promise<Pick<ICreateOrderCommandRes, 'orderId'>> {
    // ================================= //
    // 분리 작업 Before Code
    // ================================= //
    // const today = DateUtils.today();
    // const newId = RandomUtils.generatorID('order', today);
    // const generatorPrimaryKeyList: string[] = [];
    //
    // try {
    //   generatorPrimaryKeyList.push(
    //     ...RandomUtils.generatorUnionIDList(
    //       'basket',
    //       command.basketList.length,
    //     ),
    //   );
    // } catch (err) {
    //   console.error(err);
    //   throw this._throwBasketEmpty();
    // }
    // const entities: Partial<BasketEntity>[] = [];
    // // 총 금액
    // let totalAmount: number = 0;
    // // 총 갯수
    // let totalCount: number = 0;
    // const { error, isSuccess } = await this.orderRepo.transaction(
    //   async (runner) => {
    //     // 주문 정보 생성
    //     await this.orderRepo.createItem(
    //       {
    //         id: newId,
    //         user_id: command.userId,
    //         status: OrderStatus.PENDING,
    //       },
    //       { queryRunner: runner },
    //     );
    //
    //     // generatorUnionIDList 100% 문제
    //     if (command.basketList.length > generatorPrimaryKeyList.length) {
    //       throw new InternalServerErrorException('Primary Key List Error');
    //     }
    //
    //     const productIDSet = new Set<number>();
    //
    //     if (productIDSet.size <= 0) {
    //       throw new BadRequestException('Product ID Not Found Error');
    //     }
    //
    //     // 장바구니 리스트 엔티티 매핑
    //     for (let i = 0; i < command.basketList.length; i++) {
    //       const basket = command.basketList[i];
    //       productIDSet.add(basket.productId);
    //       const amount = Math.max(0, basket.amount);
    //       const count = Math.max(1, basket.count);
    //       totalAmount += amount;
    //       totalCount += count;
    //       entities.push({
    //         id: generatorPrimaryKeyList[i],
    //         product_id: basket.productId,
    //         order_id: newId,
    //         amount,
    //         count,
    //         created_at: today.toISOString(),
    //       });
    //     }
    //
    //     // 제품 검사
    //     const productMap: Map<number, ProductEntity> = new Map();
    //     const findProductList = await runner.manager.findBy(ProductEntity, {
    //       id: In(Array.from(productIDSet)),
    //     });
    //
    //     if (findProductList.length <= 0) {
    //       throw new BadRequestException('Product ID Not Found Error');
    //     }
    //
    //     // 제품 검사를 위한 매핑
    //     for (const product of findProductList) {
    //       productMap.set(product.id, product);
    //     }
    //
    //     // 제품 검사
    //     for (const entity of entities) {
    //       if (!productMap.has(entity.product_id)) {
    //         throw OrderError.ProductIDEmpty();
    //       }
    //     }
    //     await this.basketRepo.createItem(entities, { queryRunner: runner });
    //   },
    // );
    //
    // if (error || !isSuccess) {
    //   this._checkBadRequestError(error);
    //   this._checkInternalServerError(error);
    //   this._checkTransactionError(error);
    //   throw error ? error : OrderError.FailedOrder();
    // }
    //
    // this.eventBus.publish(
    //   new OrderCreatedEvent({
    //     orderId: newId,
    //     userId: command.userId,
    //     baskets: plainToInstance(
    //       BasketDomain,
    //       entities.map(
    //         (entity) =>
    //           ({
    //             orderId: entity.order_id,
    //             amount: entity.amount,
    //             count: entity.count,
    //             productId: entity.product_id,
    //             id: entity.id,
    //           }) as BasketDomain,
    //       ),
    //     ),
    //     timestamp: today.toISOString(),
    //     totalAmount,
    //     totalCount,
    //   }),
    // );
    //
    // return {
    //   orderId: newId,
    //   basketIdList: generatorPrimaryKeyList,
    //   totalCount,
    //   totalAmount,
    // };
    // ================================= //

    try {
      const today = DateUtils.today();
      const orderId = RandomUtils.generatorID('order', today);

      await this.orderRepo.createItem({
        id: orderId,
        user_id: command.userId,
        status: OrderStatus.PENDING,
      });

      // 주문 생성 완료 이벤트 발행
      this.eventBus.publish(new OrderCreatedEvent(orderId, command.userId));

      return { orderId };
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  private _throwBasketEmpty(): never {
    throw OrderError.BasketEmpty();
  }

  private _checkInternalServerError(err: unknown) {
    if (err && err instanceof InternalServerErrorException) {
      throw OrderError.FailedOrder();
    }
  }

  private _checkBadRequestError(err: unknown) {
    if (err && err instanceof BadRequestException) {
      throw OrderError.ProductIDEmpty();
    }
  }

  private _checkTransactionError(err: unknown) {
    if (err && err instanceof TypeORMError) {
      throw OrderError.FailedOrder();
    }
  }
}
