import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
@Injectable()
export class SavedRoomService {
  constructor(private prisma: PrismaService) {}
  private async getSavedRecords(userId: number, roomId: number) {
    const existingRecords = await this.prisma.savedRooms.findUnique({
      where: { userId_roomId: { userId, roomId } },
    });
    return existingRecords || null;
  }

  async saveRoom(roomId: number, userId: number) {
    const room = await this.prisma.rooms.findUnique({
      where: { id: roomId, isDeleted: false },
    });
    if (!room) {
      throw new NotFoundException('Phòng không tồn tại');
    }
    const existingRecord = await this.getSavedRecords(userId, roomId);
    if (existingRecord) {
      return { message: 'Phòng đã được lưu', data: { saved: true } };
    }
    await this.prisma.savedRooms.create({
      data: { userId, roomId },
    });
    return { message: 'Lưu phòng thành công', data: { saved: true } };
  }

  async unsaveRoom(roomId: number, userId: number) {
    const existingRecord = await this.getSavedRecords(userId, roomId);
    if (!existingRecord) {
      return { message: 'Phòng chưa được lưu', data: { saved: false } };
    }
    await this.prisma.savedRooms.delete({
      where: { userId_roomId: { userId, roomId } },
    });
    return { message: 'Bỏ lưu phòng thành công', data: { saved: false } };
  }

  getSavedRoomsByUser(userId: number) {
    const savedRooms = this.prisma.savedRooms.findMany({
      where: { userId, isDeleted: false, Rooms: { isDeleted: false } },
      include: {
        Rooms: {
          select: {
            id: true,
            name: true,
            description: true,
            locationId: true,
          },
        },
      },
    });
    return savedRooms;
  }
}
