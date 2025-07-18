import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { of } from 'rxjs';
import { OrderCreationSaga } from '@lib/e-commerce/order/saga/order-creation.saga';
import {
  BasketsCreationFailedEvent,
  OrderCreatedEvent,
  ProductsValidatedEvent,
  ProductValidationFailedEvent,
} from '@lib/e-commerce/order/event';
import { ValidateProductsCommand } from '@lib/e-commerce/order/command/validate-products.command';
import { CreateBasketsCommand } from '@lib/e-commerce/order/command/create-baskets.command';
import { CompensateOrderCommand } from '@lib/e-commerce/order/command/compensate-order.command';

describe('OrderCreationSaga', () => {
  let saga: OrderCreationSaga;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventBus: jest.Mocked<EventBus>;
  beforeEach(async () => {
    const mockEventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderCreationSaga,
        { provide: EventBus, useValue: mockEventBus },
      ],
    }).compile();

    saga = module.get<OrderCreationSaga>(OrderCreationSaga);
    eventBus = module.get(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('orderCreation', () => {
    it('should emit ValidateProductsCommand when OrderCreatedEvent received', (done) => {
      // Arrange
      const orderCreatedEvent = new OrderCreatedEvent('order123', 1);
      const events$ = of(orderCreatedEvent);

      // Mock extractProductIds method
      jest.spyOn(saga as any, 'extractProductIds').mockReturnValue([1, 2, 3]);

      // Act
      const result$ = saga.orderCreation(events$);

      // Assert
      result$.subscribe((command) => {
        expect(command).toBeInstanceOf(ValidateProductsCommand);
        expect((command as any).orderId).toBe('order123');
        expect((command as any).productIds).toEqual([1, 2, 3]);
        done();
      });
    });
  });

  describe('productValidation', () => {
    it('should emit CreateBasketsCommand when ProductsValidatedEvent received', (done) => {
      // Arrange
      const productMap = new Map();
      const productsValidatedEvent = new ProductsValidatedEvent(
        'order123',
        productMap,
      );
      const events$ = of(productsValidatedEvent);

      // Mock extractBasketList method
      const mockBasketList = [{ productId: 1, amount: 1000, count: 2 }];
      jest
        .spyOn(saga as any, 'extractBasketList')
        .mockReturnValue(mockBasketList);

      // Act
      const result$ = saga.productValidation(events$);

      // Assert
      result$.subscribe((command) => {
        expect(command).toBeInstanceOf(CreateBasketsCommand);
        expect((command as any).orderId).toBe('order123');
        expect((command as any).basketList).toEqual(mockBasketList);
        expect((command as any).productMap).toBe(productMap);
        done();
      });
    });
  });

  describe('handleProductValidationFailure', () => {
    it('should emit CompensateOrderCommand when ProductValidationFailedEvent received', (done) => {
      // Arrange
      const error = new Error('Product not found');
      const failedEvent = new ProductValidationFailedEvent('order123', error);
      const events$ = of(failedEvent);

      // Act
      const result$ = saga.handleProductValidationFailure(events$);

      // Assert
      result$.subscribe((command) => {
        expect(command).toBeInstanceOf(CompensateOrderCommand);
        expect((command as any).orderId).toBe('order123');
        expect((command as any).failedStep).toBe('ProductValidation');
        expect((command as any).error).toBe(error);
        done();
      });
    });
  });

  describe('handleBasketCreationFailure', () => {
    it('should emit CompensateOrderCommand when BasketCreationFailedEvent received', (done) => {
      // Arrange
      const error = new Error('Basket creation failed');
      const failedEvent = new BasketsCreationFailedEvent('order123', error);
      const events$ = of(failedEvent);

      // Act
      const result$ = saga.handleBasketCreationFailure(events$);

      // Assert
      result$.subscribe((command) => {
        expect(command).toBeInstanceOf(CompensateOrderCommand);
        expect((command as any).orderId).toBe('order123');
        expect((command as any).failedStep).toBe('BasketCreation');
        expect((command as any).error).toBe(error);
        done();
      });
    });
  });
});
