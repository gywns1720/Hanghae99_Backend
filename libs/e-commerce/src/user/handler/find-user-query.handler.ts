import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { FindUserQuery } from '@lib/e-commerce/user/query/find-user.query';

@QueryHandler(FindUserQuery)
export class FindUserQueryHandler implements IQueryHandler<FindUserQuery> {
  async execute(query: FindUserQuery): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
