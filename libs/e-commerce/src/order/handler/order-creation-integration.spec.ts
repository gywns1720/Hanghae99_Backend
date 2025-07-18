import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule, EventBus, CommandBus } from '@nestjs/cqrs';
import { CreateOrderCommandHandler } from '@lib/e-commerce/order/handler/create-order-command.handler';
import { OrderCreationSaga } from '@lib/e-commerce/order/saga/order-creation.saga';
import { ValidateProductsCommandHandler } from '@lib/e-commerce/order/handler/validate-products-command.handler';
import { CreateBasketsCommandHandler } from '@lib/e-commerce/order/handler/create-baskets-command.handler';
import { CompensateOrderCommandHandler } from '@lib/e-commerce/order/handler/compensate-order-command.handler';
import { CreateOrderCommand } from '@lib/e-commerce/order/command/create-order.command';

describe('Order Creation Integration', () => {
  let module: TestingModule;
  let eventBus: EventBus;
  let commandBus: CommandBus;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        OrderCreationSaga,
        CreateOrderCommandHandler,
        ValidateProductsCommandHandler,
        CreateBasketsCommandHandler,
        CompensateOrderCommandHandler,
        // Mock repositories
        {
          provide: 'OrderRepository',
          useValue: { createItem: jest.fn(), deleteItem: jest.fn() },
        },
        { provide: 'ProductRepository', useValue: { findBy: jest.fn() } },
        {
          provide: 'BasketRepository',
          useValue: { createItem: jest.fn(), deleteByOrderId: jest.fn() },
        },
      ],
    }).compile();

    eventBus = module.get<EventBus>(EventBus);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should complete full order creation workflow', async () => {
    // Arrange
    const command = new CreateOrderCommand(1, [
      { productId: 1, amount: 1000, count: 2 },
    ]);

    const eventSpy = jest.spyOn(eventBus, 'publish');

    // Act
    await commandBus.execute(command);

    // Assert
    // 이벤트 발행 순서 검증
    expect(eventSpy).toHaveBeenCalledTimes(1); // OrderCreatedEvent

    // 추가적인 통합 테스트 로직...
  });
});
