import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TokenModule } from 'src/modules-system/token/token.module';
import { UploadModule } from 'src/modules-system/upload/upload.module';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { ProtectGuard } from 'src/common/guards/protect.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [TokenModule, UploadModule],
  controllers: [LocationController],
  providers: [LocationService, PrismaService, ProtectGuard, RolesGuard],
})
export class LocationModule {}
