import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubtractPointCommand } from 'libs/e-commerce/src/user/command';

@CommandHandler(SubtractPointCommand)
export class SubtractPointHandler
  implements ICommandHandler<SubtractPointCommand>
{
  // TODO 포인트 제거 핸들러
  async execute(command: SubtractPointCommand): Promise<void> {}
}
