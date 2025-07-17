import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import KafkaConst from '@app/kafka/kafka.const';
import { Consumer, Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  protected kafka: Kafka;
  protected producer: Producer;
  protected consumer: Consumer;
  constructor(
    @Inject(KafkaConst.Inject.Group) protected readonly groupId: string,
    @Inject(KafkaConst.Inject.Client) protected readonly clientId: string,
  ) {
    this.kafka = new Kafka({
      clientId,
      brokers: KafkaConst.Brokers,
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId });
  }

  //#region [Implements]
  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
  }
  //#endregion

  async sendMessage(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
          timestamp: Date.now().toString(),
        },
      ],
    });
  }

  async subscribeToTopic(topic: string, callback: (message: any) => void) {
    await this.consumer.subscribe({ topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const messageValue = message.value?.toString();
        if (messageValue) {
          const parsedMessage = JSON.parse(messageValue);
          callback(parsedMessage);
        }
      },
    });
  }
}
