import { UserEntity } from '@lib/e-commerce/mysql/entities';
import {
  IValidatorPlugin,
  IValidatorPluginResponse,
} from '@lib/e-commerce/user/validator-plugins/i-validator-plugin';
import { HttpStatus } from '@nestjs/common';
import { SecurityUtils } from '@lib/common/utils';
import { AccountExistenceCheckerPlugin } from '@lib/e-commerce/user/validator-plugins/account-existence-checker.plugin';

export class PasswordValidatorPlugin implements IValidatorPlugin {
  async validate(
    _: string,
    password: string,
    entity: UserEntity | null | undefined,
  ): Promise<IValidatorPluginResponse> {
    if (!entity) {
      return AccountExistenceCheckerPlugin.Error;
    }
    const isEqualPassword = await SecurityUtils.compare(password, entity.pw);
    if (isEqualPassword !== 1) {
      return PasswordValidatorPlugin.Error;
    }

    return {
      isSuccess: true,
    };
  }

  static get Error(): IValidatorPluginResponse {
    return {
      status: HttpStatus.BAD_REQUEST,
      error: 'The password is incorrect',
      isSuccess: false,
    };
  }
}
