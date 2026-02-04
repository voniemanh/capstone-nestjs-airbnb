import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CLOUD_FOLDER_ROOM,
  CLOUDINARY_NAME,
} from 'src/common/constant/app.constant';
import { buildQueryPrisma } from 'src/common/helper/build-query-prisma.helper';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { CloudinaryService } from 'src/modules-system/upload/cloudinary.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomQueryDto } from './dto/room-query.dto';
@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  // ================= HELPER =================
  private userSelect = {
    id: true,
    name: true,
    avatar: true,
  };

  private async checkRoomExist(roomId: number) {
    const room = await this.prisma.rooms.findUnique({
      where: { id: roomId },
    });

    if (!room || room.isDeleted) {
      throw new NotFoundException('Room không tồn tại');
    }

    return room;
  }

  private checkOwnerOrAdmin(userId: number, user: any) {
    const isOwner = userId === user.id;
    const isAdmin = user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Không có quyền thực hiện hành động này');
    }
  }

  // ================= PUBLIC =================
  async getAllRooms(query: RoomQueryDto) {
    const result = await buildQueryPrisma({
      prismaModel: this.prisma.rooms,
      query,
      filters: query,
      filterOptions: {
        stringFields: ['name', 'description'],
        exactFields: [
          'hasWashingMachine',
          'hasIron',
          'hasTV',
          'hasAC',
          'hasWifi',
          'hasKitchen',
          'hasParking',
          'hasPool',
          'hasHeater',
          'guestCount',
          'bedroomCount',
          'bedCount',
          'bathroomCount',
          'price',
          'locationId',
          'userId',
        ],
      },
      where: { isDeleted: false },
      orderBy: { createdAt: 'asc' },
      include: {
        Users: { select: this.userSelect },
        Comments: true,
      },
    });
    return {
      message: 'Lấy danh sách rooms thành công',
      ...result,
    };
  }

  async getAllRoomsByLocation(locationId: number, query: RoomQueryDto) {
    const result = await buildQueryPrisma({
      prismaModel: this.prisma.rooms,
      query,
      filters: query,
      filterOptions: {
        stringFields: ['name', 'description'],
        exactFields: [
          'hasWashingMachine',
          'hasIron',
          'hasTV',
          'hasAC',
          'hasWifi',
          'hasKitchen',
          'hasParking',
          'hasPool',
          'hasHeater',
          'guestCount',
          'bedroomCount',
          'bedCount',
          'bathroomCount',
          'price',
          'userId',
        ],
      },
      where: { isDeleted: false, locationId },
      orderBy: { createdAt: 'asc' },
      include: {
        Users: { select: this.userSelect },
        Comments: true,
      },
    });
    return {
      message: 'Lấy danh sách rooms theo location thành công',
      ...result,
    };
  }

  async getRoomById(id: number) {
    const room = await this.prisma.rooms.findFirst({
      where: { id, isDeleted: false },
      include: {
        Users: { select: this.userSelect },
        Comments: true,
      },
    });

    if (!room) throw new NotFoundException('Room không tồn tại');
    return {
      message: 'Lấy thông tin room thành công',
      data: room,
    };
  }

  async searchRooms(keyword: string) {
    const rooms = await this.prisma.rooms.findMany({
      where: {
        AND: [
          { isDeleted: false },
          {
            name: {
              contains: keyword,
            },
          },
        ],
      },
    });
    return {
      message: 'Tìm kiếm rooms thành công',
      data: rooms,
    };
  }

  // ================= OWNER =================

  async createRoom(body: CreateRoomDto, userId: number) {
    // cấm admin tạo room (Airbnb-style)
    const user = await this.prisma.users.findUnique({
      where: { id: userId, isDeleted: false },
    });

    if (!user) {
      throw new BadRequestException('User không tồn tại');
    }

    if (user.role === 'ADMIN') {
      throw new ForbiddenException('Admin không được tạo room');
    }

    const createdRoom = await this.prisma.rooms.create({
      data: {
        ...body,
        userId,
      },
    });
    return {
      message: 'Tạo room thành công',
      data: createdRoom,
    };
  }

  async uploadImage(id: number, file: Express.Multer.File, userId: number) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file ảnh');
    }

    // Kiểm tra rooms tồn tại
    const room = await this.prisma.rooms.findFirst({
      where: { id: id, isDeleted: false },
    });
    // Nếu không tìm thấy rooms thì báo lỗi
    if (!room || room.isDeleted) {
      throw new NotFoundException('Không tìm thấy room');
    }

    if (room.userId !== userId) {
      throw new ForbiddenException('Không phải room của bạn');
    }
    // Upload ảnh mới
    const uploadResult = await this.cloudinaryService.uploadImage(
      file.buffer,
      CLOUD_FOLDER_ROOM,
    );

    // Update imageUrl mới vào DB
    await this.prisma.rooms.update({
      where: { id: id },
      data: { imageUrl: uploadResult.public_id },
    });

    // Xoá avatar cũ (nếu có)
    if (room.imageUrl) {
      await this.cloudinaryService.deleteImage(room.imageUrl);
    }

    const imageUrl = `https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/${uploadResult.public_id}`;

    return {
      message: 'Upload image thành công',
      data: { imageUrl },
    };
  }

  async updateRoom(id: number, body: UpdateRoomDto, userId: number) {
    const room = await this.checkRoomExist(id);

    if (room.userId !== userId) {
      throw new ForbiddenException('Không phải room của bạn');
    }

    const updatedRoom = await this.prisma.rooms.update({
      where: { id: id },
      data: body,
    });
    return {
      message: 'Cập nhật room thành công',
      data: updatedRoom,
    };
  }

  // ================= OWNER / ADMIN =================

  async removeRoom(id: number, user: any) {
    const room = await this.checkRoomExist(id);

    this.checkOwnerOrAdmin(room.userId, user);

    const result = await this.prisma.rooms.update({
      where: { id: id },
      data: { isDeleted: true },
    });
    return {
      message: 'Xoá room thành công',
      data: result,
    };
  }

  async getRoomsCreatedByUser(userId: number, user: any) {
    const rooms = await this.prisma.rooms.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      include: {
        Users: { select: this.userSelect },
        Comments: true,
      },
    });
    this.checkOwnerOrAdmin(userId, user);
    return {
      message: 'Lấy danh sách room do user tạo thành công',
      data: rooms,
    };
  }

  async getRoomsSavedByUser(userId: number, user: any) {
    const rooms = await this.prisma.savedRooms.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      include: {
        Users: { select: this.userSelect },
        Rooms: true,
      },
    });
    this.checkOwnerOrAdmin(userId, user);
    return {
      message: 'Lấy danh sách room đã lưu của user thành công',
      data: rooms,
    };
  }
}
