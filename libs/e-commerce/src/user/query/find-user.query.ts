import { IQuery } from '@nestjs/cqrs';

type FindUserOptions = IdOptions;

type IdOptions = {
  type: 'id';
  id: string;
};

export class FindUserQuery implements IQuery {
  constructor(readonly options: FindUserOptions) {}
}
