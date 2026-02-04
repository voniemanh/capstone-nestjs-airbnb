import { Module } from '@nestjs/common';
import { ProtectGuard } from 'src/common/guards/protect.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { TokenModule } from 'src/modules-system/token/token.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UploadModule } from 'src/modules-system/upload/upload.module';

@Module({
  imports: [TokenModule, UploadModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, ProtectGuard, RolesGuard],
})
export class UserModule {}
