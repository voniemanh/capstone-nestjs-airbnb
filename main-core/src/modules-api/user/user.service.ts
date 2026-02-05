import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  CLOUD_FOLDER_AVATAR,
  CLOUDINARY_NAME,
} from 'src/common/constant/app.constant';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { CloudinaryService } from 'src/modules-system/upload/cloudinary.service';
import { buildQueryPrisma } from 'src/common/helper/build-query-prisma.helper';
import { UserQueryDto } from './dto/user-query.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}
  private userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    avatar: true,
    createdAt: true,
  };

  async onModuleInit() {
    // Ensure that at least one admin user exists
    const adminExists = await this.prisma.users.findFirst({
      where: { email: ADMIN_EMAIL as string },
    });

    if (!adminExists) {
      const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD as string, 10);
      await this.prisma.users.create({
        data: {
          name: 'Super Admin',
          email: ADMIN_EMAIL as string,
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
    }
  }

  // Lấy tất cả users (ADMIN)
  async getAllUsers(query: UserQueryDto) {
    const result = await buildQueryPrisma({
      prismaModel: this.prisma.users,
      pagingQuery: query,
      filters: query,
      fieldOptions: { string: ['name', 'email', 'role'] },
      orderBy: { createdAt: 'asc' },
      select: this.userSelect,
    });

    return {
      message: 'Lấy danh sách users thành công',
      ...result,
    };
  }

  async getUserById(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: Number(id), isDeleted: false },
      select: this.userSelect,
    });
    if (!user) throw new NotFoundException('Không tìm thấy user');
    return {
      message: 'Lấy thông tin user thành công',
      data: user,
    };
  }

  // Tạo user mới (ADMIN)
  async createUser(data: CreateUserDto) {
    const exists = await this.prisma.users.findUnique({
      where: { email: data.email },
    });
    if (exists) throw new BadRequestException('Người dùng đã tồn tại');

    const hashedPassword = bcrypt.hashSync(data.password, 10);

    const createdUser = await this.prisma.users.create({
      data: {
        ...data,
        password: hashedPassword,
        birthday: data.birthday ? new Date(data.birthday) : null,
      },
      select: this.userSelect,
    });
    return {
      message: 'Tạo user thành công',
      data: createdUser,
    };
  }

  // Xoá user theo id (ADMIN)
  async deleteUser(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: Number(id), isDeleted: false },
    });
    if (!user) throw new NotFoundException('Không tìm thấy user');
    if (user.isDeleted) {
      throw new BadRequestException('User đã bị xoá trước đó');
    }
    const deletedUser = await this.prisma.users.update({
      where: { id: Number(id) },
      data: { isDeleted: true, updatedAt: new Date() },
      select: this.userSelect,
    });
    return {
      message: 'Xoá user thành công',
      data: deletedUser,
    };
  }

  // Lấy thông tin user hiện tại
  async getMe(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: Number(userId), isDeleted: false },
      select: this.userSelect,
    });
    if (!user) throw new NotFoundException('Không tìm thấy user');
    return {
      message: 'Lấy thông tin user thành công',
      data: user,
    };
  }

  // Cập nhật thông tin user hiện tại
  async updateMe(userId: number, data: UpdateMeDto) {
    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }
    const updatedMe = await this.prisma.users.update({
      where: { id: Number(userId) },
      data: {
        ...data,
        birthday: data.birthday ? new Date(data.birthday) : null,
      },
      select: this.userSelect,
    });
    return {
      message: 'Cập nhật thông tin user thành công',
      data: updatedMe,
    };
  }

  // Tìm kiếm user theo keyword (ADMIN)
  async searchUsers(keyword: string) {
    const lowerKeyword = keyword.toLowerCase();
    const result = await this.prisma.users.findMany({
      where: {
        OR: [
          { name: { contains: lowerKeyword } },
          { email: { contains: lowerKeyword } },
        ],
        isDeleted: false,
      },
      select: this.userSelect,
    });
    return {
      message: 'Tìm kiếm user thành công',
      data: result,
    };
  }
  // Upload avatar
  async uploadAvatar(userId: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file ảnh');
    }
    // Kiểm tra user tồn tại
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    // Nếu không tìm thấy user thì báo lỗi
    if (!user || user.isDeleted) {
      throw new NotFoundException('Không tìm thấy user');
    }

    // Upload ảnh mới
    const uploadResult = await this.cloudinaryService.uploadImage(
      file.buffer,
      CLOUD_FOLDER_AVATAR,
    );

    // Update avatar mới vào DB
    await this.prisma.users.update({
      where: { id: userId },
      data: { avatar: uploadResult.public_id },
    });

    // Xoá avatar cũ (nếu có)
    if (user.avatar) {
      await this.cloudinaryService.deleteImage(user.avatar);
    }

    const avatarUrl = `https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/${uploadResult.public_id}`;

    return {
      message: 'Upload avatar thành công',
      data: { avatarUrl },
    };
  }
}
