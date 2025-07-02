import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindManyOutboxQuery } from '@lib/e-commerce/mysql/query/find-many-outbox.query';
import { OutboxRepository } from '@lib/e-commerce/mysql/repository/outbox.repository';
import { OutboxStatus } from '@lib/e-commerce/mysql/outbox-status.enum';
import { LessThan } from 'typeorm';
import ProviderConst from '@lib/common/const/provider.const';
import { OutboxEntity } from '@lib/e-commerce/mysql/entities';

@QueryHandler(FindManyOutboxQuery)
export class FindManyOutboxQueryHandler
  implements IQueryHandler<FindManyOutboxQuery>
{
  constructor(protected readonly repo: OutboxRepository) {}
  async execute(query: FindManyOutboxQuery): Promise<OutboxEntity[]> {
    return await this.repo.findItemMany({
      where: {
        status: query.status,
        retry_count: LessThan(query.lessThanRetryCount),
        event_type: ProviderConst.Processor.Product.Rank,
      },
      order: {
        created_at: 'asc',
      },
      take: query.take,
    });
  }
}
