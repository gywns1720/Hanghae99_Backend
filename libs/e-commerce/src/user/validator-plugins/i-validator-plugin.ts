import { UserEntity } from '@lib/e-commerce/mysql/entities';
import { HttpStatus } from '@nestjs/common';

export interface IValidatorPluginResponse {
  /**
   * @summary 검증 여부
   */
  isSuccess: boolean;

  /**
   * @summary 에러 메세지
   */
  error?: string | null;

  /**
   * @summary 상태
   * @default {HttpStatus.OK || HttpStatus.BadRequest}
   */
  status?: HttpStatus;
}
/**
 * @summary 검증 플러그인 인터페이스
 */
export interface IValidatorPlugin {
  validate(
    username: string,
    password: string,
    entity: UserEntity | null | undefined,
  ): Promise<IValidatorPluginResponse>;
}
