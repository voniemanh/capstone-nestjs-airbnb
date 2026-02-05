import { Module } from '@nestjs/common';
import { SearchAppService } from './search-app.service';
import { SearchAppController } from './search-app.controller';
import { TokenModule } from 'src/modules-system/token/token.module';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { ProtectGuard } from 'src/common/guards/protect.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [TokenModule],
  controllers: [SearchAppController],
  providers: [SearchAppService, PrismaService, ProtectGuard, RolesGuard],
})
export class SearchAppModule {}
