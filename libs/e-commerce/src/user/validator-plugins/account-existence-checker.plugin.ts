import {
  IValidatorPlugin,
  IValidatorPluginResponse,
} from '@lib/e-commerce/user/validator-plugins/i-validator-plugin';
import { UserEntity } from '@lib/e-commerce/mysql/entities';
import { HttpStatus } from '@nestjs/common';
import { SecurityUtils } from '@lib/common/utils';

// 계정 존재 여부를 확인하는 클래스 플러그인
export class AccountExistenceCheckerPlugin implements IValidatorPlugin {
  async validate(
    username: string,
    password: string,
    entity: UserEntity | null | undefined,
  ): Promise<IValidatorPluginResponse> {
    if (!entity || entity.id !== username) {
      return AccountExistenceCheckerPlugin.Error;
    }

    const isEqualPassword = await SecurityUtils.compare(password, entity.pw);
    if (isEqualPassword !== 1) {
      return AccountExistenceCheckerPlugin.Error;
    }

    return {
      isSuccess: true,
    };
  }

  static get Error(): IValidatorPluginResponse {
    return {
      status: HttpStatus.BAD_REQUEST,
      error: 'Not Found User',
      isSuccess: false,
    };
  }
}
