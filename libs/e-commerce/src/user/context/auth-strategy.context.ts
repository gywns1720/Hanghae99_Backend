import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IAuthStrategy } from '@lib/e-commerce/user/i-auth';
import ProviderConst from '@lib/common/const/provider.const';
import { UserEntity } from '@lib/e-commerce/mysql/entities';

@Injectable()
export class AuthStrategyContext {
  protected readonly strategyMap: Map<string, IAuthStrategy>;

  constructor(
    @Inject(ProviderConst.AuthStrategies) strategies: IAuthStrategy[],
  ) {
    this.strategyMap = new Map(
      strategies.map((strategy) => [strategy.type, strategy]),
    );
  }

  async validate(type: string, payload: any): Promise<UserEntity | null> {
    const strategy = this.strategyMap.get(type);
    if (!strategy) throw new BadRequestException(`Unknown login type: ${type}`);
    return strategy.validate(payload);
  }
}
