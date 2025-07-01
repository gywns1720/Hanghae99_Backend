import { DynamicModule, Global, Module } from '@nestjs/common';
import Redis, { Cluster } from 'ioredis';
import ProviderConst from '@lib/common/const/provider.const';
import { ConfigService } from '@nestjs/config';
export interface RedisModuleOptions {
  mode: 'standalone' | 'cluster';
  host?: string;
  port?: number;
  clusterNodes?: { host: string; port: number }[];
}
type DynamicRedisModuleForRootProps = {
  // 글로벌 여부
  isGlobal?: boolean;

  // 포트
  port?: number;
};
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
}
