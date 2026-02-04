import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ProtectGuard } from 'src/common/guards/protect.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PagingDto } from 'src/common/dto/paging.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { UseInterceptors } from '@nestjs/common';

@UseGuards(ProtectGuard, RolesGuard)
@Controller('comments')
@UseInterceptors(CacheInterceptor)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Get('by-room/:roomId')
  findCommentByRoomId(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Query() query: PagingDto,
  ) {
    return this.commentService.findCommentByRoomId(roomId, query);
  }
  @Public()
  @Get('by-user/:userId')
  findCommentByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: PagingDto,
  ) {
    return this.commentService.findCommentByUserId(userId, query);
  }

  //Admin or User

  @Post()
  createComment(@Body() body: CreateCommentDto, @CurrentUser() user) {
    return this.commentService.createComment(body, user.id);
  }

  @Patch(':id')
  updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCommentDto,
    @CurrentUser() user,
  ) {
    return this.commentService.updateComment(id, body, user);
  }

  @Delete(':id')
  removeComment(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
    return this.commentService.removeComment(id, user);
  }
}
