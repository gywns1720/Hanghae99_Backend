import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '@lib/e-commerce/user/command/create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  async execute(command: CreateUserCommand): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
