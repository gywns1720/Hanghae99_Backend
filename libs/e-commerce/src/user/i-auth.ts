import { UserEntity } from '@lib/e-commerce/mysql/entities';

/**
 * @summary 로그인 검증 전략
 */
export interface IAuthStrategy {
  // 전략 고유 키
  readonly type: string;
  /**
   * @summary 검증 로직
   * @param payload
   */
  validate(payload: any): Promise<UserEntity | null>;
}
