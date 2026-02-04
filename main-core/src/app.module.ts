import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { AuthModule } from './modules-api/auth/auth.module';
import { CommentModule } from './modules-api/comment/comment.module';
import { BookingModule } from './modules-api/booking/booking.module';
import { UserModule } from './modules-api/user/user.module';
import { LocationModule } from './modules-api/location/location.module';
import { RoomModule } from './modules-api/room/room.module';
import { SavedRoomModule } from './modules-api/saved-room/saved-room.module';
import { UploadModule } from './modules-system/upload/upload.module';
import { ElasticSearchModule } from './modules-system/elastic-search/elastic-search.module';
import { SearchAppModule } from './modules-api/search-app/search-app.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { DATABASE_REDIS } from './common/constant/app.constant';
import { OnModuleInit, Inject } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { RabbitMQModule } from './modules-system/rabbit-mq/rabbit-mq.module';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CommentModule,
    BookingModule,
    UserModule,
    LocationModule,
    RoomModule,
    SavedRoomModule,
    UploadModule,
    ElasticSearchModule,
    SearchAppModule,
    RabbitMQModule,
    CacheModule.register({
      isGlobal: true,
      stores: [new KeyvRedis(DATABASE_REDIS)],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(@Inject('CACHE_MANAGER') private cacheManager: Cache) {}
  async onModuleInit() {
    try {
      await this.cacheManager.get('healthcheck');
      console.log('✅ Redis Cache Connected');
    } catch (error) {
      console.log('❌ Redis Cache Failed', error);
    }
  }
}
