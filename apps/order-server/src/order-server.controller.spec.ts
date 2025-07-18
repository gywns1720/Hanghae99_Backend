import { Test, TestingModule } from '@nestjs/testing';
import { OrderServerController } from './order-server.controller';
import { OrderServerService } from './order-server.service';

describe('OrderServerController', () => {
  let orderServerController: OrderServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderServerController],
      providers: [OrderServerService],
    }).compile();

    orderServerController = app.get<OrderServerController>(OrderServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(orderServerController.getHello()).toBe('Hello World!');
    });
  });
});
