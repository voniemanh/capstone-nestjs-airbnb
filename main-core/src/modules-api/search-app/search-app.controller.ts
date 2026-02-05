import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchAppService } from './search-app.service';
import { Admin } from 'src/common/decorators/roles.decorator';
import { ProtectGuard } from 'src/common/guards/protect.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(ProtectGuard, RolesGuard)
@Controller('search-app')
export class SearchAppController {
  constructor(private readonly searchAppService: SearchAppService) {}

  // http://localhost:3069/search-app?text="anhlong"&abc="abc"
  @Admin()
  @Get()
  searchApp(@Query('text') text: string) {
    return this.searchAppService.searchApp(text);
  }
}
