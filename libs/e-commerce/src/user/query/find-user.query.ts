import { IQuery } from '@nestjs/cqrs';
import { UserEntity } from '@lib/e-commerce/mysql/entities';

type FindUserOptions = IdOptions;

type IdOptions = {
  type: 'id';
  id: string;
};

export class FindUserQuery implements IQuery {
  constructor(readonly options: FindUserOptions) {}
}

export interface IFindUserQueryRes {
  entity: UserEntity | null;
}
