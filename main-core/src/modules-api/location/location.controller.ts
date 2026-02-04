import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { Admin } from 'src/common/decorators/roles.decorator';
import { ProtectGuard } from 'src/common/guards/protect.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UploadImageInterceptor } from 'src/common/interceptors/upload-image.interceptor';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationService } from './location.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { TTL, ttlMs } from 'src/common/cache/cache-ttl';
import { LocationQueryDto } from './dto/location-query.dto';

@UseGuards(ProtectGuard, RolesGuard)
@Controller('locations')
@UseInterceptors(CacheInterceptor)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
  //Admin only
  @Admin()
  @Post()
  createLocation(@Body() body: CreateLocationDto) {
    return this.locationService.createLocation(body);
  }
  @Admin()
  @Patch(':id')
  updateLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateLocationDto,
  ) {
    return this.locationService.updateLocation(id, body);
  }

  @Admin()
  @Delete(':id')
  removeLocation(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.removeLocation(id);
  }
  @Admin()
  @Post(':id/upload-location-image')
  @UseInterceptors(UploadImageInterceptor('locationImage'))
  uploadLocationImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new UnsupportedMediaTypeException('Chỉ cho phép upload ảnh');
    }
    return this.locationService.uploadLocationImage(id, file);
  }

  //Open to all users
  @Public()
  @Get()
  @CacheTTL(ttlMs(TTL.LOCATION_LIST))
  getListLocations(@Query() query: LocationQueryDto) {
    return this.locationService.getListLocations(query);
  }

  @Public()
  @Get('search')
  @CacheTTL(ttlMs(TTL.LOCATION_LIST))
  searchLocation(@Query('keyword') keyword: string) {
    return this.locationService.searchLocation(keyword);
  }
  @Public()
  @CacheTTL(ttlMs(TTL.LOCATION_DETAIL))
  @Get(':id')
  getLocationById(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.getLocationById(id);
  }
}
