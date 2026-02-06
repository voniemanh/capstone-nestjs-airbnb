import { BadRequestException, Injectable } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/modules-system/token/token.service';
import { SignupDto } from './dto/signup.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async signup(body: SignupDto) {
    const { email, password, name } = body;
    // Kiểm tra email đã tồn tại trong db hay chưa
    const userExits = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (userExits) {
      throw new BadRequestException('Người dùng đã tồn tại trong hệ thống');
    }

    // Mã hoá mật khẩu
    const hashedPassword = bcrypt.hashSync(password, 10); // 10 là độ mạnh của thuật toán

    // Lưu vào db
    const newUser = await this.prisma.users.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
      },
    });
    return {
      message: 'Đăng ký thành công',
      user: newUser,
    };
  }

  async signin(body: SigninDto) {
    const { email, password } = body;

    const userExits = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (!userExits) {
      throw new BadRequestException('Xin vui lòng đăng ký trước khi đăng nhập');
    }

    if (!userExits.password) {
      throw new BadRequestException(
        'Tài khoản này đăng nhập bằng Google, vui lòng sử dụng Google để đăng nhập',
      );
    }

    // kiểm tra password
    const isPassword = bcrypt.compareSync(password, userExits.password);
    if (!isPassword) {
      throw new BadRequestException('Mật khẩu chưa chính xác');
    }

    const tokens = this.tokenService.createTokens(userExits.id.toString());

    return tokens;
  }

  async googleCallback(req: any) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Đăng nhập Google không thành công');
    }

    const { accessToken, refreshToken } = this.tokenService.createTokens(
      user.id.toString(),
    );
    const urlRedirect = `http://localhost:3000/login-callback?accessToken=${accessToken}&refreshToken=${refreshToken}`;

    return urlRedirect;
  }

  async refreshToken(body: RefreshDto) {
    try {
      const { accessToken, refreshToken } = body;

      const decodeAccessToken = this.tokenService.verifyAccessToken(
        accessToken,
        {
          ignoreExpiration: true,
        },
      );
      const decodeRefreshToken =
        this.tokenService.verifyRefreshToken(refreshToken);

      if (decodeAccessToken.userId !== decodeRefreshToken.userId) {
        throw new BadRequestException('Refresh Token Invalid');
      }

      const userExits = await this.prisma.users.findUnique({
        where: {
          id: Number((decodeRefreshToken as any).userId),
        },
      });
      if (!userExits) {
        throw new BadRequestException('Không có người dùng');
      }

      const tokens = this.tokenService.createTokens(userExits.id.toString());

      return tokens;
    } catch (error) {
      throw error;
    }
  }
}
