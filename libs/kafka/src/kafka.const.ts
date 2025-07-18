import * as process from 'node:process';

const KafkaConst = {
  Inject: {
    Group: 'kafka.service.group_id',
    Client: 'kafka.service.client_id',
  } as const,
  Brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
  Groups: {
    User: {
      Id: 'user-service-group',
      ClientId: `user_server_${process.pid}`,
    },
    Order: {
      Id: 'order-service-group',
      ClientId: `order_server_${process.pid}`,
    },
    Log: {
      Id: 'log-service-group',
      ClientId: `log_server_${process.pid}`,
    },
  } as const,
  Topics: {
    USER_EVENT: 'user-event',
    ORDER_EVENT: 'order-event',
    LOG_EVENT: 'log-event',
  } as const,
  Actions: {
    User: {
      CreateUser: 'action.create.user',
      FindOneUser: 'action.find.one.user',
    },
  } as const,
};
export default KafkaConst;
