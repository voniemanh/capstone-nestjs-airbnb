import { Injectable } from '@nestjs/common';
import * as jsonwebtoken from 'jsonwebtoken';
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from 'src/common/constant/app.constant';

@Injectable()
export class TokenService {
  createTokens(userId: string) {
    const accessToken = jsonwebtoken.sign(
      { userId: userId },
      ACCESS_TOKEN_SECRET as string,
      { expiresIn: '1d' },
    );
    const refreshToken = jsonwebtoken.sign(
      { userId: userId },
      REFRESH_TOKEN_SECRET as string,
      { expiresIn: '1d' },
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  verifyAccessToken(accessToken: string, options?: jsonwebtoken.VerifyOptions) {
    const decode = jsonwebtoken.verify(
      accessToken,
      ACCESS_TOKEN_SECRET as string,
      options,
    ) as { userId: string };
    return decode;
  }

  verifyRefreshToken(refreshToken: string) {
    const decode = jsonwebtoken.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET as string,
    ) as { userId: string };
    return decode;
  }
}
