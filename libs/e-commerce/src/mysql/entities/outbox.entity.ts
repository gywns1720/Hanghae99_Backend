import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IDateString } from '@lib/common/type';
import { OutboxStatus } from '@lib/e-commerce/mysql/outbox-status.enum';

/**
 * @Entity 이벤트를 기록하여 트렌젝션 원자성 보장
 */
@Entity('outbox')
export class OutboxEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  event_type: string;

  @Column({ type: 'json' })
  payload: Record<string, any>;

  @Column({ type: 'datetime' })
  created_at: IDateString;

  @Column({ type: 'datetime' })
  sent_at: IDateString | null;

  @Column({ type: 'int', default: 0, comment: '재시도 횟수' })
  retry_count: number;

  @Column({
    type: 'tinyint',
    default: 0,
    comment:
      "'PENDING(0)', 'PROCESSING(1)', 'FAILED(2)', 'SENT(3)' outbox 의 상태",
  })
  status: OutboxStatus.PENDING;
}
