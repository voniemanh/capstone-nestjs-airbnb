import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthGuard } from '@nestjs/passport';
import { Get, Req, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @Public() // gắn cờ {isPublic: true}
  async signin(
    @Body()
    body: SigninDto,
  ) {
    const result = await this.authService.signin(body);
    return result;
  }

  @Post('signup')
  @Public()
  async signup(@Body() body: SignupDto) {
    return await this.authService.signup(body);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(): Promise<void> {}

  @Get('google-callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleCallback(req);
  }

  @Post('refresh-token')
  @Public()
  async refreshToken(@Body() body: RefreshDto) {
    return await this.authService.refreshToken(body);
  }
}
