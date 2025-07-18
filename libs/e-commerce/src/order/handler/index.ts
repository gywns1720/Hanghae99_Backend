// #region [EXPORT]

import { Provider } from '@nestjs/common';
import { OrderCreationSaga } from '@lib/e-commerce/order/saga/order-creation.saga';
import { OrderCompensatedEventHandler } from '@lib/e-commerce/order/handler/order-compensated-event.handler';
import { OrderProcessCompletedEventHandler } from '@lib/e-commerce/order/handler/order-process-completed-event.handler';
import { OrderCreationCommandHandler } from '@lib/e-commerce/order/handler/order-creation-command.handler';
import { CompensateOrderCommandHandler } from '@lib/e-commerce/order/handler/compensate-order-command.handler';
import { CreateBasketsCommandHandler } from '@lib/e-commerce/order/handler/create-baskets-command.handler';
import { ValidateProductsCommandHandler } from '@lib/e-commerce/order/handler/validate-products-command.handler';
import { CreateOrderCommandHandler } from '@lib/e-commerce/order/handler/create-order-command.handler';
import { FindManyBasketQueryHandler } from '@lib/e-commerce/order/handler/find-many-basket-query.handler';

const OrderHandlerProviders: Provider[] = [
  // Command Handlers
  CreateOrderCommandHandler,
  ValidateProductsCommandHandler,
  CreateBasketsCommandHandler,
  CompensateOrderCommandHandler,
  OrderCreationCommandHandler,

  // Event Handlers
  OrderProcessCompletedEventHandler,
  OrderCompensatedEventHandler,

  // Query Hanbdler
  FindManyBasketQueryHandler,

  // Saga
  OrderCreationSaga,
];
export default OrderHandlerProviders;
// #endregion
