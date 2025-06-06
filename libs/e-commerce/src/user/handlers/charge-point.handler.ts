import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChargePointCommand } from 'libs/e-commerce/src/user/command';

@CommandHandler(ChargePointCommand)
export class ChargePointHandler implements ICommandHandler<ChargePointCommand> {
  // TODO 충전 포인트 핸들러
  async execute(command: ChargePointCommand): Promise<void> {}
}
