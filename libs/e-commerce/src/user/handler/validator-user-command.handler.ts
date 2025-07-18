import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  IValidatorUserCommandResponse,
  ValidatorUserCommand,
} from '@lib/e-commerce/user/command/validator-user.command';
import { UserRepository } from '@lib/e-commerce/mysql/repository';
import { UserEntity } from '@lib/e-commerce/mysql/entities';
import { HttpStatus, Inject } from '@nestjs/common';
import { IValidatorPlugin } from '@lib/e-commerce/user/validator-plugins/i-validator-plugin';
import { UserError } from '@lib/e-commerce/user/user.error';
import ValidatorPlugins from '@lib/e-commerce/user/validator-plugins';

@CommandHandler(ValidatorUserCommand)
export class ValidatorUserCommandHandler
  implements
    ICommandHandler<ValidatorUserCommand, IValidatorUserCommandResponse>
{
  constructor(
    protected readonly repo: UserRepository,
    @Inject(ValidatorPlugins.Inject)
    protected readonly plugins: IValidatorPlugin[],
  ) {}

  async execute(
    command: ValidatorUserCommand,
  ): Promise<IValidatorUserCommandResponse> {
    const { username, password } = command.information;

    // 데이터 검증
    if (
      typeof command.options?.entity === 'undefined' ||
      command.options.entity === null
    ) {
      command.options.entity = await this._findOneUserEntityAsync(username);
    }

    // 검사 파이프라인
    try {
      await this.validatorPipe(
        username,
        password,
        command.options.entity,
        this.plugins,
      );
    } catch (err) {
      if (err instanceof UserError) {
        const toObj = err.toObject;
        return {
          error: toObj.message,
          status: toObj.status,
          isSuccess: false,
        };
      }
      return {
        error: 'Validator Error',
        status: HttpStatus.BAD_REQUEST,
        isSuccess: false,
      };
    }

    return {
      error: null,
      status: HttpStatus.OK,
      isSuccess: true,
    };
  }

  /**
   * @summary 검증 파이프
   * @param username {string} 입력한 유저 이름
   * @param password {string} 입력한 유저 패스워드
   * @param entity {UserEntity} 데이터베이스로 엔티티 불러온 값
   * @param plugins {IValidatorPlugin[]} 검사할 플러그인 리스트
   */
  async validatorPipe(
    username: string,
    password: string,
    entity: UserEntity | null | undefined,
    plugins: IValidatorPlugin[],
  ) {
    for (let i = 0; i < plugins.length; i++) {
      const plugin = plugins[i];
      const output = await plugin.validate(username, password, entity);
      if (typeof output.error === 'string' || !output.isSuccess) {
        throw new UserError(
          output.error || 'UNKNOWN',
          400,
          output.status || HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  /**
   * @summary 단일 계정을 가져옵니다.
   * @param id {string} 유저 아이디
   * @private
   */
  private async _findOneUserEntityAsync(
    id: string,
  ): Promise<UserEntity | null> {
    return await this.repo
      .findItemOne({
        where: {
          id,
        },
      })
      .catch((err) => {
        console.error('[_findUserEntityAsync] Error ', err);
        return null;
      });
  }
}
