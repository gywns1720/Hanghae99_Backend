import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { CreateOrderCommandHandler } from '@lib/e-commerce/order/handler/create-order-command.handler';
import { OrderRepository } from '@lib/e-commerce/mysql/repository';
import { CreateOrderCommand } from '@lib/e-commerce/order/command/create-order.command';
import { OrderStatus } from '@lib/e-commerce/order/order-status.enum';
import { OrderCreatedEvent } from '@lib/e-commerce/order/event';

describe('CreateOrderCommandHandler', () => {
  let handler: CreateOrderCommandHandler;
  let orderRepo: jest.Mocked<OrderRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const mockOrderRepo = {
      createItem: jest.fn(),
    };

    const mockEventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderCommandHandler,
        { provide: OrderRepository, useValue: mockOrderRepo },
        { provide: EventBus, useValue: mockEventBus },
      ],
    }).compile();

    handler = module.get<CreateOrderCommandHandler>(CreateOrderCommandHandler);
    orderRepo = module.get(OrderRepository);
    eventBus = module.get(EventBus);

    // Mock DateUtils and RandomUtils
    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2025-01-01T00:00:00.000Z');
    jest.mock('../utils/date.utils', () => ({
      DateUtils: {
        today: () => new Date('2025-01-01'),
      },
    }));
    jest.mock('../utils/random.utils', () => ({
      RandomUtils: {
        generatorID: (prefix: string) => `${prefix}_test_id_123`,
      },
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create order and publish OrderCreatedEvent', async () => {
      // Arrange
      const command = new CreateOrderCommand(1, [
        { productId: 1, amount: 1000, count: 2 },
        { productId: 2, amount: 2000, count: 1 },
      ]);

      orderRepo.createItem.mockResolvedValue(undefined);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(orderRepo.createItem).toHaveBeenCalledWith({
        id: expect.stringContaining('order_test_id'),
        user_id: 1,
        status: OrderStatus.PENDING,
      });

      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.any(OrderCreatedEvent),
      );

      expect(result).toEqual({
        orderId: expect.stringContaining('order_test_id'),
      });
    });

    it('should throw error when order creation fails', async () => {
      // Arrange
      const command = new CreateOrderCommand(1, []);
      const error = new Error('Database connection failed');
      orderRepo.createItem.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        'Failed to create order: Database connection failed',
      );

      expect(eventBus.publish).not.toHaveBeenCalled();
    });
  });
});
