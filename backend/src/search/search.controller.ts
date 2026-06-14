import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}
  @Get() search(@Query('q') q: string, @Query('page') page?: number) { return this.searchService.search(q, page); }
  @Get('suggestions') suggestions(@Query('q') q: string) { return this.searchService.suggestions(q); }
}
