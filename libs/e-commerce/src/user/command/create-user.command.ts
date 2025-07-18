import { ICommand } from '@nestjs/cqrs';
import { CreateUserDomain } from '@lib/e-commerce/user/domain';
import { QueryRunner } from 'typeorm';

export class CreateUserCommand implements ICommand {
  constructor(
    readonly users: CreateUserDomain[],
    readonly runner?: QueryRunner,
  ) {}
}
