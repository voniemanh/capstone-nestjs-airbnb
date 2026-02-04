import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TokenModule } from 'src/modules-system/token/token.module';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { ProtectGuard } from 'src/common/guards/protect.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RedisModule } from 'src/modules-system/redis/redis.module';

@Module({
  imports: [TokenModule, RedisModule],
  controllers: [BookingController],
  providers: [BookingService, PrismaService, ProtectGuard, RolesGuard],
})
export class BookingModule {}
