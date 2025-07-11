import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import {
  CreateOrderCommand,
  ICreateOrderCommandRes,
} from '@lib/e-commerce/order/command/create-order.command';
import { CreateOrderCommandHandler } from '@lib/e-commerce/order/handler/create-order-command.handler';
import {
  FindManyBasketQuery,
  IFindManyBasketQueryRes,
} from '@lib/e-commerce/order/query/find-many-basket.query';
// 메인 엔트리포인트 - 기존 CommandHandler 대체
@CommandHandler(CreateOrderCommand)
export class OrderCreationCommandHandler
  implements ICommandHandler<CreateOrderCommand>
{
  constructor(
    private readonly createOrderHandler: CreateOrderCommandHandler,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(command: CreateOrderCommand): Promise<ICreateOrderCommandRes> {
    try {
      // 주문 생성 시작 - 나머지는 Saga가 처리
      const { orderId } = await this.createOrderHandler.execute(command);

      const resQueryData = await this.queryBus.execute<
        FindManyBasketQuery,
        IFindManyBasketQueryRes
      >(new FindManyBasketQuery(orderId));

      // 임시로 동기적 응답 반환 (실제로는 비동기 처리)
      // 실제 구현에서는 별도의 조회 API나 웹소켓을 통해 결과 전달
      return {
        orderId,
        basketIdList: resQueryData.entities.map((item) => item.id), // Saga 완료 후 업데이트
        totalCount: resQueryData.totalCount, // Saga 완료 후 업데이트
        totalAmount: resQueryData.totalAmount, // Saga 완료 후 업데이트
      };
    } catch (error) {
      throw error;
    }
  }
}
