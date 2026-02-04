import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: 'localhost', // hoặc docker host
          port: 6381, // port docker Redis bạn đang chạy
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
