import { Controller, Get, Query } from '@nestjs/common';
import { SearchAppService } from './search-app.service';

@Controller('search-app')
export class SearchAppController {
  constructor(private readonly searchAppService: SearchAppService) {}

  // http://localhost:3069/search-app?text="anhlong"&abc="abc"
  @Get()
  searchApp(@Query('text') text: string) {
    return this.searchAppService.searchApp(text);
  }
}
