import { Injectable } from '@nestjs/common';
import { EventBus, IEvent, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import {
  BasketsCreatedEvent,
  BasketsCreationFailedEvent,
  OrderCreatedEvent,
  OrderProcessCompletedEvent,
  ProductsValidatedEvent,
  ProductValidationFailedEvent,
} from '@lib/e-commerce/order/event';
import { ValidateProductsCommand } from '@lib/e-commerce/order/command/validate-products.command';
import { CreateBasketsCommand } from '@lib/e-commerce/order/command/create-baskets.command';
import { CompensateOrderCommand } from '@lib/e-commerce/order/command/compensate-order.command';

@Injectable()
export class OrderCreationSaga {
  constructor(private readonly eventBus: EventBus) {}

  @Saga()
  orderCreation = (events$: Observable<IEvent>): Observable<IEvent> => {
    return events$.pipe(
      ofType(OrderCreatedEvent),
      map((event: OrderCreatedEvent) => {
        // 주문 생성 완료 후 제품 검증 시작
        const productIds = this.extractProductIds(event); // 실제 구현 필요
        return new ValidateProductsCommand(event.orderId, productIds);
      }),
    );
  };

  @Saga()
  productValidation = (events$: Observable<IEvent>): Observable<IEvent> => {
    return events$.pipe(
      ofType(ProductsValidatedEvent),
      map((event: ProductsValidatedEvent) => {
        // 제품 검증 완료 후 장바구니 생성 시작
        const basketList = this.extractBasketList(event); // 실제 구현 필요
        return new CreateBasketsCommand(
          event.orderId,
          basketList,
          event.productMap,
        );
      }),
    );
  };

  @Saga()
  basketCreation = (events$: Observable<IEvent>): Observable<IEvent> => {
    return events$.pipe(
      ofType(BasketsCreatedEvent),
      map((event: BasketsCreatedEvent) => {
        // 장바구니 생성 완료 후 최종 완료 이벤트 발행
        return new OrderProcessCompletedEvent(
          event.orderId,
          event.userId,
          event.basketIdList,
          event.totalAmount,
          event.totalCount,
        );
      }),
    );
  };

  @Saga()
  handleProductValidationFailure = (
    events$: Observable<IEvent>,
  ): Observable<IEvent> => {
    return events$.pipe(
      ofType(ProductValidationFailedEvent),
      map((event: ProductValidationFailedEvent) => {
        // 제품 검증 실패 시 보상 트랜잭션 실행
        return new CompensateOrderCommand(
          event.orderId,
          'ProductValidation',
          event.error,
        );
      }),
    );
  };

  @Saga()
  handleBasketCreationFailure = (
    events$: Observable<IEvent>,
  ): Observable<IEvent> => {
    return events$.pipe(
      ofType(BasketsCreationFailedEvent),
      map((event: BasketsCreationFailedEvent) => {
        // 장바구니 생성 실패 시 보상 트랜잭션 실행
        return new CompensateOrderCommand(
          event.orderId,
          'BasketCreation',
          event.error,
        );
      }),
    );
  };

  private extractProductIds(event: OrderCreatedEvent): number[] {
    // 실제 구현에서는 원본 커맨드나 저장된 데이터에서 추출
    // 임시로 빈 배열 반환
    return [];
  }

  private extractBasketList(event: ProductsValidatedEvent): Array<{
    productId: number;
    amount: number;
    count: number;
  }> {
    // 실제 구현에서는 원본 커맨드나 저장된 데이터에서 추출
    // 임시로 빈 배열 반환
    return [];
  }
}
