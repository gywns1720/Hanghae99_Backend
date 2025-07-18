import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOutboxCommand } from '@lib/e-commerce/mysql/command';
import { OutboxRepository } from '@lib/e-commerce/mysql/repository/outbox.repository';
import { DateUtils } from '@lib/common/utils';
import { In } from 'typeorm';

@CommandHandler(UpdateOutboxCommand)
export class UpdateOutboxCommandHandler
  implements ICommandHandler<UpdateOutboxCommand>
{
  constructor(protected readonly repo: OutboxRepository) {}

  /**
   *
   * @param command
   * @throws Error 예외처리 발생시 에러 리젝
   */
  async execute(command: UpdateOutboxCommand): Promise<any> {
    await this.repo.updateItem(
      {
        status: command.options.status,
        sent_at: !!command.options.writeSentAt
          ? DateUtils.today().toISOString()
          : undefined,
        retry_count: command.options.retryCount,
      },
      [
        {
          where: Array.isArray(command.options.id)
            ? 'id In (:...ids)'
            : 'id = :ids',
          parameters: {
            ids: Array.isArray(command.options.id)
              ? In(command.options.id)
              : command.options.id,
          },
        },
      ],
      command.options.runner,
    );
  }
}
