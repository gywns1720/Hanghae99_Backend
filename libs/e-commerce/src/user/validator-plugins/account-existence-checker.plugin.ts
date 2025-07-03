import {
  IValidatorPlugin,
  IValidatorPluginResponse,
} from '@lib/e-commerce/user/validator-plugins/i-validator-plugin';
import { UserEntity } from '@lib/e-commerce/mysql/entities';
import { HttpStatus, Injectable } from '@nestjs/common';
import { SecurityUtils } from '@lib/common/utils';
import { UserLockProvider } from '@lib/e-commerce/user/provider/user-lock.provider';

// 계정 존재 여부를 확인하는 클래스 플러그인
@Injectable()
export class AccountExistenceCheckerPlugin implements IValidatorPlugin {
  constructor(protected readonly userLockProvider: UserLockProvider) {}
  async validate(
    username: string,
    password: string,
    entity: UserEntity | null | undefined,
  ): Promise<IValidatorPluginResponse> {
    const isLock = await this.userLockProvider.hasLockUserId(username);

    if (isLock) {
      return AccountExistenceCheckerPlugin.LockError;
    }

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
  static get LockError(): IValidatorPluginResponse {
    return {
      status: HttpStatus.CONFLICT,
      error: 'Username is already being checked by another process',
      isSuccess: false,
    };
  }
}
