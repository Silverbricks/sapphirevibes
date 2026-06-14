import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (config: ConfigService) => {
        // Railway provides REDIS_URL; fallback to individual vars for local dev
        const redisUrl = config.get<string>('REDIS_URL');
        return redisUrl
          ? new Redis(redisUrl, { lazyConnect: true })
          : new Redis({
              host: config.get('REDIS_HOST', 'localhost'),
              port: config.get<number>('REDIS_PORT', 6379),
              password: config.get('REDIS_PASSWORD') || undefined,
              lazyConnect: true,
            });
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
