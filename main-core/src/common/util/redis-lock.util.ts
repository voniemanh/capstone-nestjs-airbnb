import { Redis } from 'ioredis';

export class RedisLock {
  constructor(private redis: Redis) {}

  async acquire(key: string, ttl = 10000): Promise<boolean> {
    const result = await this.redis.set(key, 'locked', 'PX', ttl, 'NX');

    return result === 'OK';
  }

  async release(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async runWithLock<T>(
    key: string,
    fn: () => Promise<T>,
    ttl = 10000,
  ): Promise<T> {
    const acquired = await this.acquire(key, ttl);
    if (!acquired) throw new Error('Resource is locked, try again');

    try {
      return await fn();
    } finally {
      await this.release(key);
    }
  }
}
