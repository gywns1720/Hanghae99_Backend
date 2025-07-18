import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '@lib/e-commerce/mysql/entities';
import { IValidatorPluginResponse } from '@lib/e-commerce/user/validator-plugins/i-validator-plugin';

/**
 * @summary 응답값
 * @extends IValidatorPluginResponse
 */
export interface IValidatorUserCommandResponse
  extends IValidatorPluginResponse {}

type Information = { username: string; password: string };

interface IValidatorUserCommandOptions {
  /**
   * @summary 이미 데이터 베이스 접근된 상태인가?
   */
  entity?: UserEntity | null;
}

export class ValidatorUserCommand implements ICommand {
  constructor(
    readonly information: Information,
    readonly options: IValidatorUserCommandOptions = {},
  ) {}
}
