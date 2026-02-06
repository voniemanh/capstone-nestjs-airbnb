import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
} from 'src/common/constant/app.constant';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly prisma: PrismaService) {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new BadRequestException('Google OAuth credentials are missing');
    }

    super({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;
    const googleId = profile.id;
    const avatar = profile.photos?.[0]?.value;

    if (!email) {
      throw new BadRequestException('Google account has no email');
    }

    let user = await this.prisma.users.findFirst({
      where: {
        OR: [{ email }, { googleId }],
      },
    });

    if (!user) {
      user = await this.prisma.users.create({
        data: {
          email,
          name,
          avatar,
          googleId,
        },
      });
    }

    return user;
  }
}
