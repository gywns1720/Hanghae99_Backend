import { Test, TestingModule } from '@nestjs/testing';
import { LogServerController } from './log-server.controller';
import { LogServerService } from './log-server.service';

describe('LogServerController', () => {
  let logServerController: LogServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LogServerController],
      providers: [LogServerService],
    }).compile();

    logServerController = app.get<LogServerController>(LogServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(logServerController.getHello()).toBe('Hello World!');
    });
  });
});
