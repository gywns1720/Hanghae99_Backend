import { Test, TestingModule } from '@nestjs/testing';
import { UserServerController } from './user-server.controller';
import { UserServerService } from './user-server.service';

describe('UserServerController', () => {
  let userServerController: UserServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserServerController],
      providers: [UserServerService],
    }).compile();

    userServerController = app.get<UserServerController>(UserServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(userServerController.getHello()).toBe('Hello World!');
    });
  });
});
