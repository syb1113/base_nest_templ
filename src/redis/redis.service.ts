import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

<<<<<<< HEAD
  async hashGet(key: string) {
    return await this.redisClient.hGetAll(key);
  }

  async hashSet(key: string, obj: Record<string, any>, ttl?: number) {
    for (const name in obj) {
      await this.redisClient.hSet(key, name, String(obj[name]));
    }
=======
  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);
>>>>>>> email-login-backend

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
<<<<<<< HEAD

    return key;
=======
>>>>>>> email-login-backend
  }
}
