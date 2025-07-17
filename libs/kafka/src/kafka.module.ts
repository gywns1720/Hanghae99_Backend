import { DynamicModule, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import KafkaConst from '@app/kafka/kafka.const';

@Module({
  providers: [
    {
      provide: KafkaConst.Inject,
      useValue: 'default',
    },
    KafkaService,
  ],
  exports: [KafkaConst.Inject, KafkaService],
})
export class KafkaModule {
  static registry(groupId: string): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        {
          provide: KafkaConst.Inject,
          useValue: groupId,
        },
        KafkaService,
      ],
      exports: [KafkaConst.Inject, KafkaService],
    };
  }
}
