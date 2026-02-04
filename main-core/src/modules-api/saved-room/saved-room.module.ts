import { Module } from '@nestjs/common';
import { SavedRoomService } from './saved-room.service';
import { SavedRoomController } from './saved-room.controller';
import { TokenModule } from 'src/modules-system/token/token.module';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { ProtectGuard } from 'src/common/guards/protect.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [TokenModule],
  controllers: [SavedRoomController],
  providers: [SavedRoomService, PrismaService, ProtectGuard, RolesGuard],
})
export class SavedRoomModule {}
