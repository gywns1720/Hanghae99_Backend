

# STEP 16 Transaction Diagnosis

우리 서비스의 규모가 확장되어 MSA의 형태로 각 도메인별로 배포 단위를 분리해야한다면 각각 어떤 도메인으로 배포 단위를 설계할 것인지 결정하고, 
그 분리에 따른 트랜잭션 처리의 한계와 해결방안에 대한 서비스 설계 문서 작성


## 현황 및 문제점

각각의 서비스는 단일 트랜잭션 내에서 주문 생성, 결제 연동, 재고 차감, 쿠폰 발급 등 여러 책임을 강하게 결합된 모놀리식 구조이다.

예시로 주문 서비스 경우
- 성능 저하 : 주문 요청 하나에 포함된 동기적 작업들이 많아 사용자 응답 시간 길어짐.
- 낮은 확장성 : 특정 기능(알림) 같은 부가적인 서비스 부하가 전체 주문 서비스에 영향을 미칩니다.
- 강한 결합도 : 재고나 알림 정책의 변경이 주문 핵심 로직에 영향을 주어 유지보수 힘들어짐.


## Event 기반 아키텍쳐 도입 

- 주로 관심사를 분리 시키는 역활

NestJS 의 `EventEmitterModule` 을 활용하여 동기적인 강결합로직을 비동기 이벤트 기반으로 분리하여 트랜재션과 부가적인 관심사를 분리합니다.


### 개선해야 할 목표

1. 각 기능의 트랜잭션은 **핵심 데이터** 생성에만 집중 !!
2. 부가적인 서비스 (알림 발송) 등은 주문 성공 이후에 발생하는 이벤트를 구독하여 비동기적으로 처리

### 프로세스 설계

1. 주문 접수 `Controller` 에서 들어옵니다.
2. 트랜잭션 시작 `Service` 서비스는 `CQRS 패턴` 으로 작성된 `Command`, `Query` 를 조합하여 트랜잭션을 시작합니다.
3. 핵심로직 처리 를 하기 위해 필요한 정보의 상태를 저장 합니다.
4. 트랜잭션 커밋 및 이벤트 발행 : 트랜잭션이 성공적으로 커밋된 이후 `CQRS 패턴의 Event` 를 발행합니다.
    | `EventEmitterModule` 혹은 `Event` 이벤트를 발행 합니다. (**이 방식은 모놀리식 방식에 유용**, **MSA 방식은 외부 메세지 큐 시스템**)
    | 시스템을 분산 환경으로 확장하거나 데이터의 안정적인 거리가 중요하다면 반드시 **메세지 브로커**를 사용해야 한다.
5. 이벤트 리스너 처리

_예시 코드_

```ts
// order.service.ts
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateOrderCommandResponse, CreateOrderCommand } from '@lib/e-commerce/src/order/command'
@Injectable()
export class OrderService {
  constructor(
    private readonly comamndBus: CommandBus,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    // DB 트랜잭션 내에서 주문 생성
    const newOrder = await this.comamndBus.execute<CreateOrderCommand, CreateOrderCommandResponse>(new CreateOrderCommand({
      id : createOrderDto.id,
      status : "PENDING"
    }))
    
    // 트랜잭션 성공 후 이벤트 발행
    this.eventEmitter.emit('order.created', { orderId: newOrder.id });

    return { message: '주문이 성공적으로 접수되었습니다.' }; // 사용자에게 즉시 응답
  }
}
```
```ts
// inventory.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { InventoryDecreaseStockCommand ,InventoryDecreaseStockCommandResponse} from '@lib/e-commerce/product/command/inventory-decrease-stock.command';
@Injectable()
export class InventoryListener {
  constructor(private readonly comamndBus: CommandBus) {}

  @OnEvent('order.created')
  async handleOrderCreatedEvent(payload: { orderId: string }) {
    console.log(`주문(${payload.orderId}) 생성 이벤트 수신. 재고 차감을 시작합니다.`);
    const result = await this.comamndBus.execute<InventoryDecreaseStockCommand, InventoryDecreaseStockCommandResponse>(new InventoryDecreaseStockCommand(payload.orderId))
    
  }
}
```
위 **기대 효과**

- **사용자 경험 개선** : 주문 요청 응답시간 크게 단축
- **장애 격리** : 알림 서버 장애가 발생해도 주문 접수 자체는 정상적 처리됨.
- **유연성 증가** : 새로운 관심사가 추가되어도 기존 로직 수정 없이 이벤트 리스너만 추가하면 됨.


## MSA 전환 설계

- 서비스가 더욱 성장하여 팀 단위의 자율성과 기술 스택 다양성, 독립적인 배포 및 확장이 중요해지는 시점에는 **MSA 전환 고려**

### Domain 분리 설계

`DDD (Domain-Driven Design)` 의 BoundedContext 개념을 기반으로 각 서비스를 독립적인 배포 단위 (MSA)로 설계합니다.

- 주문 서비스
  - 상품 판매에 관련된 주문 생성, 상태 관리, 내역 조회 등 주문의 라이프사이클을 총괄
- 결제 서비스
  - PG 연동, 결제 요청/승인/취소 처리/내역 관리
- 재고 서비스
  - 상품 재고, 수량, 업데이트 관리
- 쿠폰 서비스
  - 쿠폰 발행, 수량, 이벤트 관리
- 알림 서비스
  - 결제를 할 경우 이메일 혹은 SMS 푸시 알림 등 사용자들이 알 수 있도록 알림 발송


### MSA 전환에 따른 트랜잭션 처리 한계와 해결 방안 

**분산 트랜잭션 문제**
- 각 서비스가 자체 데이터베이스를 가지게 되면서 단일 DB 트랜잭션으로는 데이터 일관성을 보장할 수 없게 된다.

### 데이터 정합성 문제

- 주문생성 👉 결제 성공 👉 재고 차감 실패 상황일 때, 이미 처리된 결제를 취소하고 주문 상태를 '실패' 로 변경하는 등 여러 서비스에 걸친 작업을 원자적으로 묶어야 한다.
- 전통적인 2PC(Two-Phase Commit) 방식은 동기적 블로킹으로 시스템 전체 성능을 저하시키고 특정 코디네이터에 의존성이 높아 MSA 환경에는 적합하지 않다.

---

## 해결 방안 Saga Pattern

- Saga 패턴은 여러 서비스에 걸친 일련의 로컬 트랜잭션을 순차적으로 실행하는 모델.
- 각 로컬 트랜잭션이 완료되면 다음 서비스에 작업을 요청한느 이벤트를 발행.
- 중간에 트랜잭션이 실패하면, 이전까지 성공했던 트랜잭션을 모두 취소하는 보상 트랜잭션 (Compensating Transaction) 을 실행하여 데이터 정합성을 결과적으로 (Eventually Consistent) 맞춘다.

|         구조         |       트랜잭션 관리        | CQRS 결합도 |          트랜잭션 Command 분리           |  
|:------------------:|:--------------------:|:--------:|:----------------------------------:|
|     모놀리식 CQRS      |       한곳 에서 처리       |    쉽다    | `createTransactionCommand` 등 구현 가능 |   
| Choreography Saga  |      각 서비스 자체적       |   복잡함    |             불가능하거나 부적합             |   
| Orchestration Saga | 중앙 SagaManager 에서 관리 |  적당히 쉬움  |           가능, 구현 복잡도가 큼            |
 


### ❌ Choreography-based Saga (코레오그래피 기반 사가)  

_CQRS 랑 잘 맞지 않음_

- 중앙 오케스트레이터 없이 각 서비스가 이벤트를 발행하고 구독하여 자율적으로 상호작용 하는 방식

1. 주문 생성 후 이벤트틀 메세지 큐로 발행
2. 이벤트를 구독하여 결제를 처리하고, 성공시 **성공 이벤트**를 발행, 실패시 **실패 이벤트** 발행
3. **성공 이벤트**를 구독하여 재고를 차감하고, 성공시 **재고 변경 이벤트**를 발행, 실패시 **재고 부족 이벤트** 발행
4. (보상 트랜잭션)
   1. 주문서비스는 결재 실패 이벤트, 재고 부족 이벤트를 구독하여 주문 상태를 캔슬 상태로 변경
   2. 결제 서비스는 재고 부족 이벤트를 구독하여 이미 성공한 **결제를 취소하는 이벤트**를 발행

### 원자적 이벤트 발행 보장 (Outbox 패턴)

DB 주문 정보를 저장 (Commit) 하고 메세지 큐에 이벤트를 발행 하는 두 작업은 원자적이지 않습니다.
DB 커밋 후 이벤트 발행 전에 서비스가 다운되면, 주문은 생성됐지만 후속 처리가 누락되는 심각한 데이터 불일치가 발생합니다.

1. 단일 트랜잭션 : 주문 서비스는 하나의 트랜잭션 안에서 두 가지 작업을 함께 처리합니다.
2. 이벤트 발행 : 별도의 메세지 릴레이 프로세스가 주기적으로 `outbox` 테이블을 풀링(polling) 합니다.
3. 메시지 큐 전송 : 릴레이는 `outbox` 테이블에서 아직 발행되지 않은 이벤트를 읽어 메세지 큐로 전송하고, 성공적으로 전송되면 해당 이벤트를 `outbox` 테이블에서 삭제하거나 `발행 완료`로 표시한다.

본 설계는 점진적인 서비스 개선 전략을 제시합니다.

---
1단계에서는 모놀리식 구조 내에서 이벤트를 활용해 관심사를 분리함으로써 즉각적인 성능 개선과 유연성 확보를 추구합니다.
2단계에서는 비즈니스 성장에 발맞춰 각 도메인을 독립적인 마이크로서비스로 분리하여 확장성과 개발 자율성을 극대화합니다.

### ✅ Orchestration-based Saga (오케스트레이션 기반 사가) 

#### 역활

- 사가 오케스트라는 특정 비즈니스 프로세스의 '프로젝트 매니져' 또는 '지휘자' 와 같습니다. 여러 서비스에 걸친 복잡한 작업 흐름 관리
  - **프로세스 관리**: 주문 생성이라는 비즈니스 프로세스 완료하기 위해 어떤 서비스들을 어떤 순서로 호출 해야하는지 알고 있음.
  - **상태 관리** : 프로세스가 어디까지 진행되었는지 추적 가능
  - **오류 처리** 및 보상 트랜잭션 : 특정 단계에서 실패가 발생하면, 이전에 성공했던 작업들은 모두 취소시키는 보상 트랜잭션을 실행하여 데이터 일관성 맞춤.

#### 위치

1. 프로세스 시작하는 서비스 내부 구현 (흔함)
    - 주문 사가의 경우 주문 서비스가 오케스트레이터의 역활을 겸하는 경우가 많다.
2. 별도의 오케스트레이터 서비스로 구현
   - 이 경우는 신중한 설계가 필요.


#### CQRS 랑 오케스트레이션 기반 사가랑 왜 맞을까?

이 두 관계는 CQRS 악보, Saga 지휘자 와 비유 됨.

- **CQRS** (Command And Query Responsibility Segregation) : 데이터 처리 방식에 대한 패턴
  - **Command** : 상태 변경 작업 (생성, 수정, 삭제)
  - **Query** : 상태 조회 (변경 없는 읽기만 가능)
  - 쓰기 모델과 읽기 모델을 분리하여 각 작업에 최적화된 데이터 구조와 기술을 사용해 성능과 확장성 높임.
- **Orchestration-based Saga** : 분산 트랜잭션에 대한 패턴
  - 여러 서비스에 걸친 긴 비즈니스 프로세스의 흐름을 중앙에서 지휘
  - 특정 작업 실패, 이전 성공한 작업들 취소 하여 전체 프로세스의 데이터 일관성을 맞춘다.

CQRS가 "무엇을 할지"에 대한 구조화된 방법을 제공한다면, Saga Orchestrator는 그 "무엇"들을 올바른 순서와 흐름으로 엮어 복잡하고 안정적인 비즈니스 로직을 완성하는 역할을 진행.


#### 예시 시나리오

1.커맨드 및 이벤트 정의
```ts
// --- orders/commands/impl/create-order.command.ts ---
export class CreateOrderCommand {
  constructor(public readonly userId: string, public readonly amount: number) {}
}

// --- orders/events/impl/order-created.event.ts ---
export class OrderCreatedEvent {
  constructor(public readonly orderId: string, public readonly amount: number) {}
}

// --- payments/commands/impl/process-payment.command.ts ---
export class ProcessPaymentCommand {
  constructor(public readonly orderId: string, public readonly amount: number) {}
}

// --- payments/events/impl/payment-successful.event.ts ---
export class PaymentSuccessfulEvent {
  constructor(public readonly orderId: string) {}
}

// ... 다른 모든 커맨드와 이벤트들도 유사하게 정의 ...
```

2.주문 사가
```ts
// --- orders/sagas/orders.saga.ts ---
import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ProcessPaymentCommand } from '../../payments/commands/impl/process-payment.command';
import { DeductStockCommand } from '../../inventory/commands/impl/deduct-stock.command';
import { CompleteOrderCommand } from '../commands/impl/complete-order.command';
import { CancelOrderCommand } from '../commands/impl/cancel-order.command';
import { OrderCreatedEvent } from '../events/impl/order-created.event';
import { PaymentSuccessfulEvent } from '../../payments/events/impl/payment-successful.event';
import { PaymentFailedEvent } from '../../payments/events/impl/payment-failed.event';
import { StockDeductedEvent } from '../../inventory/events/impl/stock-deducted.event';
import { StockDeductionFailedEvent } from '../../inventory/events/impl/stock-deduction-failed.event';

@Injectable()
export class OrdersSaga {
  // 1. 주문 생성 이벤트가 발생하면, 결제 커맨드를 실행하라고 지휘한다.
  @Saga()
  orderCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(OrderCreatedEvent),
      map(event => new ProcessPaymentCommand(event.orderId, event.amount)),
    );
  };

  // 2. 결제 성공 이벤트가 발생하면, 재고 차감 커맨드를 실행하라고 지휘한다.
  @Saga()
  paymentSuccessful = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(PaymentSuccessfulEvent),
      map(event => new DeductStockCommand(event.orderId)),
    );
  };

  // 3. 재고 차감 성공 이벤트가 발생하면, 주문 완료 커맨드를 실행하라고 지휘한다.
  @Saga()
  stockDeducted = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(StockDeductedEvent),
      map(event => new CompleteOrderCommand(event.orderId)),
    );
  };
  
  // 4. 실패 시나리오: 결제나 재고 처리 중 실패하면 주문 취소 커맨드를 실행한다 (보상 트랜잭션).
  @Saga()
  orderFailed = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(PaymentFailedEvent, StockDeductionFailedEvent),
      map(event => new CancelOrderCommand(event.orderId)),
    );
  };
}
```

3.각 서비스의 커맨드 핸들러
```ts
// --- orders/commands/handlers/create-order.handler.ts ---
@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly eventBus: EventBus, // 이벤트를 발행하기 위해 주입
  ) {}

  async execute(command: CreateOrderCommand): Promise<any> {
    const { userId, amount } = command;
    // 1. 주문을 'PENDING' 상태로 DB에 생성
    const order = await this.orderRepository.create(userId, amount);

    // 2. Saga를 시작시키기 위해 'OrderCreatedEvent' 발행
    this.eventBus.publish(new OrderCreatedEvent(order.id, order.amount));
  }
}

// --- payments/commands/handlers/process-payment.handler.ts ---
@CommandHandler(ProcessPaymentCommand)
export class ProcessPaymentHandler implements ICommandHandler<ProcessPaymentCommand> {
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: ProcessPaymentCommand): Promise<any> {
    const { orderId } = command;

    // 외부 PG사 연동 등 결제 로직 수행...
    const isSuccess = Math.random() > 0.1; // 90% 확률로 성공한다고 가정

    if (isSuccess) {
      // 성공 시 Saga에게 보고
      console.log(`[Payment] Order ${orderId}: Payment successful.`);
      this.eventBus.publish(new PaymentSuccessfulEvent(orderId));
    } else {
      // 실패 시 Saga에게 보고
      console.error(`[Payment] Order ${orderId}: Payment failed.`);
      this.eventBus.publish(new PaymentFailedEvent(orderId));
    }
  }
}
```
주요 흐름 요약

1. 클라이언트가 CreateOrderCommand를 날리면 CreateOrderHandler가 주문을 PENDING 상태로 만들고 OrderCreatedEvent를 발행합니다.
2. OrdersSaga가 이 이벤트를 감지하고 ProcessPaymentCommand를 생성하여 시스템에 전달합니다.
3. ProcessPaymentHandler가 이 커맨드를 받아 결제를 처리하고, 결과에 따라 PaymentSuccessfulEvent 또는 PaymentFailedEvent를 발행합니다.
4. OrdersSaga가 다시 이 결과 이벤트를 감지하여 다음 커맨드(DeductStockCommand)를 생성하거나 보상 커맨드(CancelOrderCommand)를 생성합니다.
5. 이 과정이 모든 단계가 성공하거나 중간에 실패하여 취소될 때까지 반복됩니다.
