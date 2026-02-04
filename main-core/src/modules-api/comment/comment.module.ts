import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TokenModule } from 'src/modules-system/token/token.module';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { ProtectGuard } from 'src/common/guards/protect.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [TokenModule],
  controllers: [CommentController],
  providers: [CommentService, PrismaService, ProtectGuard, RolesGuard],
})
export class CommentModule {}
