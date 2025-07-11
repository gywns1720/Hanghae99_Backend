import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { CreateBasketsCommandHandler } from '@lib/e-commerce/order/handler/create-baskets-command.handler';
import { BasketRepository } from '@lib/e-commerce/mysql/repository';
import { ProductEntity } from '@lib/e-commerce/mysql/entities';
import { CreateBasketsCommand } from '@lib/e-commerce/order/command/create-baskets.command';
import { BasketsCreationFailedEvent } from '@lib/e-commerce/order/event';

describe('CreateBasketsCommandHandler', () => {
  let handler: CreateBasketsCommandHandler;
  let basketRepo: jest.Mocked<BasketRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const mockBasketRepo = {
      createItem: jest.fn(),
    };

    const mockEventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBasketsCommandHandler,
        { provide: BasketRepository, useValue: mockBasketRepo },
        { provide: EventBus, useValue: mockEventBus },
      ],
    }).compile();

    handler = module.get<CreateBasketsCommandHandler>(
      CreateBasketsCommandHandler,
    );
    basketRepo = module.get(BasketRepository);
    eventBus = module.get(EventBus);

    // Mock RandomUtils
    jest.mock('../utils/random.utils', () => ({
      RandomUtils: {
        generatorUnionIDList: (prefix: string, count: number) =>
          Array.from({ length: count }, (_, i) => `${prefix}_${i + 1}`),
      },
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create baskets and publish BasketsCreatedEvent', async () => {
      // Arrange
      const productMap = new Map<number, ProductEntity>([
        [
          1,
          {
            id: 1,
            title: 'Product 1',
            price: 1000,
            amount: 30,
          } as ProductEntity,
        ],
        [
          2,
          {
            id: 2,
            title: 'Product 2',
            price: 2000,
            amount: 20,
          } as ProductEntity,
        ],
        [
          3,
          {
            id: 3,
            title: 'Product 3',
            price: 3000,
            amount: 40,
          } as ProductEntity,
        ],
      ]);

      const command = new CreateBasketsCommand(
        'order123',
        [
          { productId: 1, amount: 1000, count: 2 },
          { productId: 2, amount: 2000, count: 1 },
        ],
        productMap,
      );

      basketRepo.createItem.mockResolvedValue(undefined);

      // Act
      await handler.execute(command);

      // Assert
      expect(basketRepo.createItem).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 'basket_1',
          product_id: 1,
          order_id: 'order123',
          amount: 1000,
          count: 2,
        }),
        expect.objectContaining({
          id: 'basket_2',
          product_id: 2,
          order_id: 'order123',
          amount: 2000,
          count: 1,
        }),
      ]);

      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: 'order123',
          basketIdList: ['basket_1', 'basket_2'],
          totalAmount: 3000,
          totalCount: 3,
        }),
      );
    });

    it('should publish BasketCreationFailedEvent when product not in map', async () => {
      // Arrange
      const productMap = new Map<number, ProductEntity>([
        [
          1,
          {
            id: 1,
            title: 'Product 1',
            price: 1000,
            amount: 30,
          } as ProductEntity,
        ],
      ]);

      const command = new CreateBasketsCommand(
        'order123',
        [
          { productId: 1, amount: 1000, count: 2 },
          { productId: 999, amount: 2000, count: 1 }, // Not in productMap
        ],
        productMap,
      );

      // Act
      await handler.execute(command);

      // Assert
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.any(BasketsCreationFailedEvent),
      );

      expect(basketRepo.createItem).not.toHaveBeenCalled();
    });

    it('should handle negative amounts and counts correctly', async () => {
      // Arrange
      const productMap = new Map<number, ProductEntity>([
        [
          1,
          {
            id: 1,
            title: 'Product 1',
            price: 1000,
            amount: 30,
          } as ProductEntity,
        ],
      ]);

      const command = new CreateBasketsCommand(
        'order123',
        [
          { productId: 1, amount: -100, count: 0 }, // Should be corrected to 0 and 1
        ],
        productMap,
      );

      basketRepo.createItem.mockResolvedValue(undefined);

      // Act
      await handler.execute(command);

      // Assert
      expect(basketRepo.createItem).toHaveBeenCalledWith([
        expect.objectContaining({
          amount: 0, // Math.max(0, -100)
          count: 1, // Math.max(1, 0)
        }),
      ]);
    });
  });
});
