import { Injectable } from '@nestjs/common';
import { IAuthStrategy } from '@lib/e-commerce/user/i-auth';
import { UserEntity } from '@lib/e-commerce/mysql/entities';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindUserQuery } from '@lib/e-commerce/user/query/find-user.query';
import { ValidatorUserCommand } from '@lib/e-commerce/user/command/validator-user.command';

@Injectable()
export class IdPasswordStrategy implements IAuthStrategy {
  static Name() {
    return 'id-password';
  }
  readonly type: string;
  constructor(
    protected readonly queryBus: QueryBus,
    protected readonly commandBus: CommandBus,
  ) {
    this.type = IdPasswordStrategy.Name();
  }

  async validate(payload: {
    id: string;
    pw: string;
  }): Promise<UserEntity | null> {
    // 계정을 검색합니다.
    const entity = await this.queryBus.execute(
      new FindUserQuery({ id: payload.id, type: 'id' }),
    );

    // 검증 절차를 시작합니다.
    await this.commandBus.execute(new ValidatorUserCommand());
    return entity as UserEntity | null;
  }
}
