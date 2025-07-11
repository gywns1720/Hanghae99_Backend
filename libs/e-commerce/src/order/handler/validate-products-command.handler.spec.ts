import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { In } from 'typeorm';
import { ValidateProductsCommandHandler } from '@lib/e-commerce/order/handler/validate-products-command.handler';
import { ProductRepository } from '@lib/e-commerce/mysql/repository';
import { ValidateProductsCommand } from '@lib/e-commerce/order/command/validate-products.command';
import { ProductEntity } from '@lib/e-commerce/mysql/entities';
import {
  ProductsValidatedEvent,
  ProductValidationFailedEvent,
} from '@lib/e-commerce/order/event';

describe('ValidateProductsCommandHandler', () => {
  let handler: ValidateProductsCommandHandler;
  let productRepo: jest.Mocked<ProductRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const mockProductRepo = {
      findBy: jest.fn(),
    };

    const mockEventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateProductsCommandHandler,
        { provide: ProductRepository, useValue: mockProductRepo },
        { provide: EventBus, useValue: mockEventBus },
      ],
    }).compile();

    handler = module.get<ValidateProductsCommandHandler>(
      ValidateProductsCommandHandler,
    );
    productRepo = module.get(ProductRepository);
    eventBus = module.get(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should validate products and publish ProductsValidatedEvent', async () => {
      // Arrange
      const command = new ValidateProductsCommand('order123', [1, 2, 3]);
      const mockProducts: ProductEntity[] = [
        { id: 1, title: 'Product 1', price: 1000, amount: 30 } as ProductEntity,
        { id: 2, title: 'Product 2', price: 2000, amount: 20 } as ProductEntity,
        { id: 3, title: 'Product 3', price: 3000, amount: 40 } as ProductEntity,
      ];

      productRepo.findBy.mockResolvedValue(mockProducts);

      // Act
      await handler.execute(command);

      // Assert
      expect(productRepo.findBy).toHaveBeenCalledWith({
        id: In([1, 2, 3]),
      });

      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: 'order123',
          productMap: expect.any(Map),
        }),
      );

      const publishedEvent = eventBus.publish.mock
        .calls[0][0] as ProductsValidatedEvent;
      expect(publishedEvent.productMap.size).toBe(3);
      expect(publishedEvent.productMap.get(1)).toEqual(mockProducts[0]);
    });

    it('should publish ProductValidationFailedEvent when no product IDs provided', async () => {
      // Arrange
      const command = new ValidateProductsCommand('order123', []);

      // Act
      await handler.execute(command);

      // Assert
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: 'order123',
          error: expect.any(BadRequestException),
        }),
      );

      expect(productRepo.findBy).not.toHaveBeenCalled();
    });

    it('should publish ProductValidationFailedEvent when products not found', async () => {
      // Arrange
      const command = new ValidateProductsCommand('order123', [1, 2]);
      productRepo.findBy.mockResolvedValue([]);

      // Act
      await handler.execute(command);

      // Assert
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: 'order123',
          error: expect.any(BadRequestException),
        }),
      );
    });

    it('should publish ProductValidationFailedEvent when some products missing', async () => {
      // Arrange
      const command = new ValidateProductsCommand('order123', [1, 2, 3]);
      const mockProducts: ProductEntity[] = [
        { id: 1, title: 'Product 1', price: 1000, amount: 30 } as ProductEntity,
        { id: 2, title: 'Product 2', price: 2000, amount: 20 } as ProductEntity,
        { id: 3, title: 'Product 3', price: 3000, amount: 40 } as ProductEntity,
        // Product 3 missing
      ];

      productRepo.findBy.mockResolvedValue(mockProducts);

      // Act
      await handler.execute(command);

      // Assert
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.any(ProductValidationFailedEvent),
      );
    });
  });
});
