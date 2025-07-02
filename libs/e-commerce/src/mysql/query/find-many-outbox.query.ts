import { OutboxStatus } from '@lib/e-commerce/mysql/outbox-status.enum';

/**
 * @summary Outbox 여러개 가져오는 쿼리
 */
export class FindManyOutboxQuery {
  constructor(
    readonly status: number = OutboxStatus.PENDING,
    readonly lessThanRetryCount: number = 5,
    readonly take = 10,
  ) {}
}
