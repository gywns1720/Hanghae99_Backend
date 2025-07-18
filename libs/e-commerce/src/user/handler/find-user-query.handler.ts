import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { FindUserQuery } from '@lib/e-commerce/user/query/find-user.query';
import { UserRepository } from '@lib/e-commerce/mysql/repository';

@QueryHandler(FindUserQuery)
export class FindUserQueryHandler implements IQueryHandler<FindUserQuery> {
  constructor(protected readonly repo: UserRepository) {}
  async execute(query: FindUserQuery): Promise<any> {
    const entity = await this.repo.findItemOne({
      where: {
        id: query.options.id,
      },
    });

    return {
      entity,
    };
  }
}
