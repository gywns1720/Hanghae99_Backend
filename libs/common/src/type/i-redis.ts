import * as Redis from 'ioredis';

/**
 * @summary 레디스
 */
export type IRedis = Redis.Redis | Redis.Cluster;
