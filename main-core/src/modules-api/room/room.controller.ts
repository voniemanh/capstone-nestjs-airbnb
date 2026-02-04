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
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { ProtectGuard } from 'src/common/guards/protect.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UploadImageInterceptor } from 'src/common/interceptors/upload-image.interceptor';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomService } from './room.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { TTL, ttlMs } from 'src/common/cache/cache-ttl';
import { RoomQueryDto } from './dto/room-query.dto';

@UseGuards(ProtectGuard, RolesGuard)
@Controller('rooms')
@UseInterceptors(CacheInterceptor)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
  //PUBLIC
  @Public()
  @Get()
  @CacheTTL(ttlMs(TTL.ROOM_LIST))
  getAllRooms(@Query() query: RoomQueryDto) {
    return this.roomService.getAllRooms(query);
  }
  @Public()
  @Get('by-location/:locationId')
  @CacheTTL(ttlMs(TTL.ROOM_LIST))
  getAllRoomsByLocation(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Query() query: RoomQueryDto,
  ) {
    return this.roomService.getAllRoomsByLocation(locationId, query);
  }

  @Public()
  @Get('search')
  @CacheTTL(ttlMs(TTL.ROOM_LIST))
  searchRooms(@Query('keyword') keyword: string) {
    return this.roomService.searchRooms(keyword);
  }

  @Public()
  @Get(':id')
  @CacheTTL(ttlMs(TTL.ROOM_DETAIL))
  getRoomById(@Param('id', ParseIntPipe) id: number) {
    return this.roomService.getRoomById(id);
  }
  //Owner
  @Post()
  createRoom(@Body() body: CreateRoomDto, @CurrentUser() user) {
    console.log('JWT user:', user.id);
    return this.roomService.createRoom(body, user.id);
  }

  @Post(':id/upload-image')
  @UseInterceptors(UploadImageInterceptor('roomImage'))
  uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user,
  ) {
    if (!file) {
      throw new UnsupportedMediaTypeException('Chỉ cho phép upload ảnh');
    }
    return this.roomService.uploadImage(id, file, user.id);
  }

  @Patch(':id')
  updateRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRoomDto,
    @CurrentUser() user,
  ) {
    return this.roomService.updateRoom(id, body, user.id);
  }
  //Owner/Admin
  @Get('created/:userId')
  @CacheTTL(ttlMs(TTL.ROOM_LIST))
  getRoomsCreatedByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() user,
  ) {
    return this.roomService.getRoomsCreatedByUser(userId, user);
  }

  @Get('saved/:userId')
  @CacheTTL(ttlMs(TTL.ROOM_LIST))
  getRoomsSavedByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() user,
  ) {
    return this.roomService.getRoomsSavedByUser(userId, user);
  }

  @Delete(':id')
  removeRoom(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
    return this.roomService.removeRoom(id, user);
  }
}
