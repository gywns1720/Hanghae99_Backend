import { QueryRunner } from 'typeorm';
import { ICommand } from '@nestjs/cqrs';

type UpdateOutboxOptions = {
  // 아이디
  id: number | number[];
  // 상태
  status: number;
  // sent_at 작성 ?
  writeSentAt?: boolean;
  // 횟수 카운트
  retryCount?: number;
  // Query Runner
  runner?: QueryRunner;
};
export class UpdateOutboxCommand implements ICommand {
  constructor(readonly options: UpdateOutboxOptions) {}
}
