import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { CompensateOrderCommandHandler } from '@lib/e-commerce/order/handler/compensate-order-command.handler';
import {
  BasketRepository,
  OrderRepository,
} from '@lib/e-commerce/mysql/repository';
import { CompensateOrderCommand } from '@lib/e-commerce/order/command/compensate-order.command';
import { OrderCompensatedEvent } from '@lib/e-commerce/order/event';

describe('CompensateOrderCommandHandler', () => {
  let handler: CompensateOrderCommandHandler;
  let orderRepo: jest.Mocked<OrderRepository>;
  let basketRepo: jest.Mocked<BasketRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const mockOrderRepo = {
      deleteItem: jest.fn(),
    };

    const mockBasketRepo = {
      deleteByOrderId: jest.fn(),
    };

    const mockEventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompensateOrderCommandHandler,
        { provide: OrderRepository, useValue: mockOrderRepo },
        { provide: BasketRepository, useValue: mockBasketRepo },
        { provide: EventBus, useValue: mockEventBus },
      ],
    }).compile();

    handler = module.get<CompensateOrderCommandHandler>(
      CompensateOrderCommandHandler,
    );
    orderRepo = module.get(OrderRepository);
    basketRepo = module.get(BasketRepository);
    eventBus = module.get(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete order when ProductValidation failed', async () => {
      // Arrange
      const error = new Error('Product validation failed');
      const command = new CompensateOrderCommand(
        'order123',
        'ProductValidation',
        error,
      );

      orderRepo.deleteItem.mockResolvedValue(undefined);

      // Act
      await handler.execute(command);

      // Assert
      expect(orderRepo.deleteItem).toHaveBeenCalledWith('order123');
      expect(basketRepo.deleteItem).not.toHaveBeenCalled();
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: 'order123',
          reason: 'ProductValidation: Product validation failed',
        }),
      );
    });

    it('should delete order when BasketCreation failed', async () => {
      // Arrange
      const error = new Error('Basket creation failed');
      const command = new CompensateOrderCommand(
        'order123',
        'BasketCreation',
        error,
      );

      orderRepo.deleteItem.mockResolvedValue(undefined);

      // Act
      await handler.execute(command);

      // Assert
      expect(orderRepo.deleteItem).toHaveBeenCalledWith('order123');
      expect(basketRepo.deleteItem).not.toHaveBeenCalled();
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.any(OrderCompensatedEvent),
      );
    });

    it('should delete both baskets and order when OrderProcessing failed', async () => {
      // Arrange
      const error = new Error('Order processing failed');
      const command = new CompensateOrderCommand(
        'order123',
        'OrderProcessing',
        error,
      );

      basketRepo.deleteItem.mockResolvedValue(undefined);
      orderRepo.deleteItem.mockResolvedValue(undefined);

      // Act
      await handler.execute(command);

      // Assert
      expect(basketRepo.deleteItem).toHaveBeenCalledWith('order123');
      expect(orderRepo.deleteItem).toHaveBeenCalledWith('order123');
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.any(OrderCompensatedEvent),
      );
    });

    it('should handle compensation errors gracefully', async () => {
      // Arrange
      const error = new Error('Original error');
      const command = new CompensateOrderCommand(
        'order123',
        'ProductValidation',
        error,
      );
      const compensationError = new Error('Compensation failed');

      orderRepo.deleteItem.mockRejectedValue(compensationError);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      await handler.execute(command);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        'Compensation failed for order order123:',
        compensationError,
      );

      consoleSpy.mockRestore();
    });
  });
});
