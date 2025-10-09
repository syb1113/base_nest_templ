import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(): Promise<RedisClientType> {
        const client: RedisClientType = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          database: 1,
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
