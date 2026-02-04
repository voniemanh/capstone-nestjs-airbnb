import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ProtectGuard } from 'src/common/guards/protect.guard';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { TokenModule } from 'src/modules-system/token/token.module';
import { UploadModule } from 'src/modules-system/upload/upload.module';

@Module({
  imports: [TokenModule, UploadModule],
  controllers: [RoomController],
  providers: [RoomService, PrismaService, ProtectGuard, RolesGuard],
})
export class RoomModule {}
