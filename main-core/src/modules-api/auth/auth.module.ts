import { Module } from '@nestjs/common';
import { TokenModule } from 'src/modules-system/token/token.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [TokenModule, PassportModule.register({ session: false })],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
