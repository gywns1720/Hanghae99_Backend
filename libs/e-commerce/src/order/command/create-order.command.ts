import { ICommand } from '@nestjs/cqrs';

/**
 * @summary 주문 커맨드
 */
export class CreateOrderCommand implements ICommand {}
