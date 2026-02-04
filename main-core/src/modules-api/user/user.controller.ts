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
import { Admin } from 'src/common/decorators/roles.decorator';
import { ProtectGuard } from 'src/common/guards/protect.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UploadImageInterceptor } from 'src/common/interceptors/upload-image.interceptor';
// import { PagingDto } from '../../common/dto/paging.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { UserService } from './user.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { TTL, ttlMs } from 'src/common/cache/cache-ttl';
import { UserQueryDto } from './dto/user-query.dto';

@Controller('users')
@UseGuards(ProtectGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  // ================= ADMIN =================
  @Admin()
  @Get()
  getAllUsers(@Query() query: UserQueryDto) {
    const result = this.userService.getAllUsers(query);
    return result;
  }

  @Admin()
  @Get('id/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    const result = this.userService.getUserById(id);
    return result;
  }

  @Admin()
  @Post()
  createUser(@Body() body: CreateUserDto) {
    const result = this.userService.createUser(body);
    return result;
  }

  @Admin()
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @Admin()
  @Get('search')
  searchUsers(@Query('keyword') keyword: string) {
    const result = this.userService.searchUsers(keyword);
    return result;
  }

  // ================= USER =================
  @Get('me')
  @CacheTTL(ttlMs(TTL.USER_ME))
  getMe(@CurrentUser() user) {
    const result = this.userService.getMe(user.id);
    return result;
  }

  @Patch('me')
  updateMe(@CurrentUser() user, @Body() body: UpdateMeDto) {
    const result = this.userService.updateMe(user.id, body);
    return result;
  }

  @Post('upload-avatar')
  @UseInterceptors(UploadImageInterceptor('avatar'))
  uploadAvatar(@CurrentUser() user, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new UnsupportedMediaTypeException('Chỉ cho phép upload ảnh');
    }
    return this.userService.uploadAvatar(user.id, file);
  }
}
