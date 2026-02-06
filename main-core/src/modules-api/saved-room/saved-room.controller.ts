import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ProtectGuard } from 'src/common/guards/protect.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { SavedRoomService } from './saved-room.service';

@UseGuards(ProtectGuard, RolesGuard)
@Controller('saved-room')
export class SavedRoomController {
  constructor(private readonly savedRoomService: SavedRoomService) {}

  @Get()
  getSavedRoomsByUser(@CurrentUser() user) {
    return this.savedRoomService.getSavedRoomsByUser(user.id);
  }

  @Post('save/:roomId')
  saveRoom(@Param('roomId', ParseIntPipe) roomId: number, @CurrentUser() user) {
    return this.savedRoomService.saveRoom(roomId, user.id);
  }
  @Delete('unsave/:roomId')
  unsaveRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
    @CurrentUser() user,
  ) {
    return this.savedRoomService.unsaveRoom(roomId, user.id);
  }
}
