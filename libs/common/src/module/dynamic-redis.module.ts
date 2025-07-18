import { DynamicModule, Global, Module } from '@nestjs/common';
import Redis, { Cluster } from 'ioredis';
import ProviderConst from '@lib/common/const/provider.const';
import { ConfigService } from '@nestjs/config';
import { IRedis } from '@lib/common/type';
export interface RedisModuleOptions {
  mode: 'standalone' | 'cluster';
  host?: string;
  port?: number;
  clusterNodes?: { host: string; port: number }[];
}
type Callback = (configService: ConfigService) => IRedis;
type PromiseCallback = (configService: ConfigService) => Promise<IRedis>;
type forRootFactoryProps = {
  // 글로벌 여부
  isGlobal?: boolean;

  onFactory: Callback | PromiseCallback;
};
type DynamicRedisModuleForRootProps = Pick<forRootFactoryProps, 'isGlobal'> & {
  // 포트
  port?: number;
};
function isPromise<T = any>(value: any): value is Promise<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.then === 'function' &&
    typeof value.catch === 'function'
  );
}

/**
 * @Module
 */
@Global()
@Module({
  providers: [
    {
      provide: ProviderConst.Redis,
      useFactory: () => new Redis({ host: 'localhost', port: 6379 }),
    },
  ],
  exports: [ProviderConst.Redis],
})
export class DynamicRedisModule {
  static forRoot(options: RedisModuleOptions): DynamicModule {
    return {
      module: DynamicRedisModule,
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: () => {
            if (options.mode === 'cluster') {
              return new Redis.Cluster(options.clusterNodes);
            }
            return new Redis({
              host: options.host,
              port: options.port,
            });
          },
        },
      ],
      exports: ['REDIS_CLIENT'],
    };
  }
  static forRootAsync({
    isGlobal,
  }: DynamicRedisModuleForRootProps): DynamicModule {
    return {
      module: DynamicRedisModule,
      global: isGlobal,
      providers: [
        {
          provide: ProviderConst.Redis,
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            const mode = config.get<'cluster' | 'standalone'>('REDIS_MODE');

            if (mode === 'cluster') {
              const clusterNodes = config
                .get<string>('REDIS_CLUSTER_NODES')
                .split(',')
                .map((node) => {
                  const [host, port] = node.split(':');
                  return { host, port: parseInt(port) };
                });

              return new Cluster(clusterNodes);
            }

            // default: standalone
            return new Redis({
              host: config.get('REDIS_HOST'),
              port: config.get<number>('REDIS_PORT'),
            });
          },
        },
      ],
      exports: [ProviderConst.Redis],
    };
  }

  static forRootFactory({
    isGlobal,
    onFactory,
  }: forRootFactoryProps): DynamicModule {
    return {
      module: DynamicRedisModule,
      global: isGlobal,
      providers: [
        {
          provide: ProviderConst.Redis,
          inject: [ConfigService],
          useFactory: async (config: ConfigService) => {
            if (isPromise<PromiseCallback>(onFactory)) {
              return await (onFactory as PromiseCallback)(config);
            } else {
              return onFactory(config);
            }
          },
        },
      ],
      exports: [ProviderConst.Redis],
    };
  }
}
