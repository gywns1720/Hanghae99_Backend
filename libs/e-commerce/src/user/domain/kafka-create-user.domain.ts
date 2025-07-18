import { CreateUserDomain } from '@lib/e-commerce/user/domain/create-user.domain';
import { IPrimaryKey } from '@lib/common/type';

/**
 * @domain
 */
export class KafkaCreateUserDomain {
  domain: CreateUserDomain;
  waitId: IPrimaryKey;
}
