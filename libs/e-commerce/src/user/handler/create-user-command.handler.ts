import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '@lib/e-commerce/user/command/create-user.command';
import { UserRepository } from '@lib/e-commerce/mysql/repository';
import { UserLockProvider } from '@lib/e-commerce/user/provider/user-lock.provider';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    protected readonly repo: UserRepository,
    protected readonly userLockProvider: UserLockProvider,
  ) {}
  async execute(command: CreateUserCommand): Promise<any> {
    const userIdArr = command.users.map((user) => user.id);

    // 먼저 사용자 생성 시도
    await this.repo.createItem(
      command.users.map(
        (user) => ({
          id: user.id,
          name: user.name,
          point: typeof user.point === 'number' ? user.point : 0,
        }),
        command.runner,
      ),
    );
    await Promise.all(
      userIdArr.map(async (id) => {
        try {
          await this.userLockProvider.deleteLock(id);
        } catch (err) {
          // 최소한 로그는 남긴다
          console.warn(`[Lock] Failed to delete lock for userId=${id}`, err);
        }
      }),
    );
  }
}
