import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { Redis } from 'ioredis';
import { buildQueryPrisma } from 'src/common/helper/build-query-prisma.helper';
import { RedisLock } from 'src/common/util/redis-lock.util';
import { Prisma } from 'src/modules-system/prisma/generated/prisma/browser';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { BookingQueryDto } from './dto/booking-query.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ClientProxy } from '@nestjs/microservices';
import { SENDER_EMAIL } from 'src/common/constant/app.constant';

@Injectable()
export class BookingService {
  private lock: RedisLock;

  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject('EMAIL_SERVICE') private readonly emailClient: ClientProxy,
  ) {
    this.lock = new RedisLock(this.redis);
  }
  //helpers
  private userSelect = {
    id: true,
    name: true,
    email: true,
    avatar: true,
  };

  private bookingOverlapWhere = (roomId: number, from: Date, to: Date) => ({
    roomId,
    status: 'CONFIRMED',
    checkIn: { lt: to },
    checkOut: { gt: from },
  });

  private createBookingLog = (
    prisma: Prisma.TransactionClient,
    bookingId: number,
    action: string,
    performedBy: number,
  ) => {
    return prisma.bookingLogs.create({
      data: { bookingId, action, performedBy },
    });
  };
  //Validate
  private validateBookingDates(checkIn: Date, checkOut: Date) {
    if (dayjs(checkIn).isAfter(dayjs(checkOut))) {
      throw new BadRequestException('Ngày check-in phải trước ngày check-out');
    }
    if (dayjs(checkIn).isBefore(dayjs(), 'day')) {
      throw new BadRequestException(
        'Ngày check-in phải từ ngày hiện tại trở đi',
      );
    }
  }

  private async checkRoomExists(roomId: number) {
    const room = await this.prisma.rooms.findUnique({ where: { id: roomId } });
    if (!room || room.isDeleted) {
      throw new NotFoundException('Không tìm thấy phòng');
    }
    return room;
  }
  private async checkBookingExist(userId: number) {
    const bookings = await this.prisma.bookings.findMany({
      where: {
        userId,
        status: { notIn: ['CANCELLED', 'ADMIN_CANCELLED'] },
      },
    });

    if (!bookings.length) {
      throw new NotFoundException('Không tìm thấy booking');
    }

    return bookings;
  }
  /**
   * Tính giá phòng dựa trên dịp lễ, weekend
   */
  private async calculatePrice(
    roomId: number,
    checkIn: Date,
    checkOut: Date,
    bookingGuestCount: number,
  ): Promise<number> {
    const room = await this.prisma.rooms.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Không tìm thấy phòng');

    const basePrice = room.price || 0;
    const baseGuestCount = room.guestCount || 1;
    const extraGuestCount = Math.max(0, bookingGuestCount - baseGuestCount);
    const extraGuestRate = 0.2; // +20% / guest / night
    let total = 0;
    let current = dayjs(checkIn);

    while (current.isBefore(dayjs(checkOut), 'day')) {
      let multiplier = 1;

      // weekend
      if ([0, 6].includes(current.day())) multiplier += 0.2;

      // holiday
      if (
        current.format('MM-DD') === '12-25' ||
        current.format('MM-DD') === '01-01'
      ) {
        multiplier += 0.5;
      }

      // phụ thu guest theo đêm
      multiplier += extraGuestCount * extraGuestRate;

      total += basePrice * multiplier;
      current = current.add(1, 'day');
    }

    return total;
  }

  // ---------------------------
  // CRUD
  // ---------------------------
  /**
   * Tạo booking với Redis lock + transaction
   */
  async createBooking(userId: number, dto: CreateBookingDto) {
    // kiểm tra room tồn tại
    await this.checkRoomExists(dto.roomId);
    // tạo khóa lock
    const lockKey = `booking-lock:${dto.roomId}`;
    return await this.lock.runWithLock(
      lockKey,
      async () => {
        // kiểm tra trùng lặp booking
        const overlap = await this.prisma.bookings.findFirst({
          where: this.bookingOverlapWhere(
            dto.roomId,
            dto.checkIn,
            dto.checkOut,
          ),
        });

        if (overlap) {
          throw new BadRequestException(
            'Phòng không khả dụng trong khoảng thời gian này',
          );
        }
        // validate ngày tháng
        this.validateBookingDates(dto.checkIn, dto.checkOut);
        // tính tổng giá
        const totalPrice = await this.calculatePrice(
          dto.roomId,
          dto.checkIn,
          dto.checkOut,
          dto.guestCount,
        );
        // tạo booking trong transaction
        return await this.prisma.$transaction(async (tx) => {
          const booking = await tx.bookings.create({
            data: {
              roomId: dto.roomId,
              userId,
              checkIn: dto.checkIn,
              checkOut: dto.checkOut,
              guestCount: dto.guestCount,
              status: 'CONFIRMED',
            },
          });
          const user = await tx.users.findUnique({ where: { id: userId } });
          this.emailClient.emit('send_email', {
            bookingId: booking.id,
            email: SENDER_EMAIL,
            name: user?.name,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            totalPrice,
          });

          console.log(`Email sent to ${user?.email} for booking ${booking.id}`);
          // log action
          await this.createBookingLog(tx, booking.id, 'CREATED', userId);

          return {
            message: 'Tạo booking thành công',
            data: { ...booking, totalPrice },
          };
        });
      },
      20000,
    ); // 20s lock
  }

  /**
   * Cancel booking (owner)
   */
  async cancelBooking(userId: number, bookingId: number) {
    const booking = await this.prisma.bookings.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Không tìm thấy booking');

    if (booking.userId !== userId)
      throw new BadRequestException('Không có quyền hủy booking này');

    if (booking.status !== 'CONFIRMED')
      throw new BadRequestException('Không thể hủy booking');

    return await this.prisma.$transaction(async (tx) => {
      const cancelled = await tx.bookings.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
      });
      //log action
      await tx.bookingLogs.create({
        data: { bookingId, action: 'CANCELLED', performedBy: userId },
      });

      // TODO: trigger refund / notification / webhook here

      return { message: 'Hủy booking thành công', data: cancelled };
    });
  }

  /**
   * Admin cancel
   */
  async adminCancelBooking(adminId: number, bookingId: number) {
    const booking = await this.prisma.bookings.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Không tìm thấy booking');
    if (booking.status === 'ADMIN_CANCELLED' || booking.status === 'CANCELLED')
      throw new BadRequestException('Booking đã bị hủy');

    return await this.prisma.$transaction(async (tx) => {
      const cancelled = await tx.bookings.update({
        where: { id: bookingId },
        data: { status: 'ADMIN_CANCELLED' },
      });

      await this.createBookingLog(tx, bookingId, 'ADMIN_CANCELLED', adminId);

      // TODO: trigger refund / notification / webhook here

      return { message: 'Booking bị hủy bởi admin', data: cancelled };
    });
  }

  /**
   * Get bookings availability for a room
   */
  async getAvailability(roomId: number, from: Date, to: Date) {
    // 1. Lấy các booking overlap
    const bookings = await this.prisma.bookings.findMany({
      where: this.bookingOverlapWhere(roomId, from, to),
      orderBy: {
        checkIn: 'asc',
      },
    });

    const freeSlots: { from: Date; to: Date }[] = [];

    // 2. Con trỏ bắt đầu từ `from`
    let cursor = from;

    for (const booking of bookings) {
      if (!booking.checkIn || !booking.checkOut) {
        continue;
      }

      // Nếu có khoảng trống trước booking
      if (cursor < booking.checkIn) {
        freeSlots.push({
          from: cursor,
          to: booking.checkIn,
        });
      }

      // Đẩy cursor tới cuối booking (nếu cần)
      if (cursor < booking.checkOut) {
        cursor = booking.checkOut;
      }
    }

    // 3. Nếu sau booking cuối vẫn còn trống
    if (cursor < to) {
      freeSlots.push({
        from: cursor,
        to: to,
      });
    }

    return {
      roomId,
      from,
      to,
      freeSlots,
    };
  }

  /**
   * Get bookings for a user
   */
  async getMyBookings(userId: number, query: BookingQueryDto) {
    await this.checkBookingExist(userId);
    const result = await buildQueryPrisma({
      prismaModel: this.prisma.bookings,
      query,
      filters: query,
      where: { userId },
      filterOptions: {
        stringFields: ['note'],
        exactFields: ['roomId', 'status'],
      },
      include: {
        Rooms: true,
        Users: { select: this.userSelect },
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      message: 'Lấy danh sách booking thành công',
      ...result,
    };
  }
  /**
   * Get bookings for admin
   */
  async getAllBookings(query: BookingQueryDto) {
    const result = await buildQueryPrisma({
      prismaModel: this.prisma.bookings,
      query,
      filters: query,
      filterOptions: {
        stringFields: ['note'],
        exactFields: ['roomId', 'status', 'userId'],
      },
      include: {
        Rooms: true,
        Users: { select: this.userSelect },
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      message: 'Lấy danh sách booking thành công',
      ...result,
    };
  }

  async getBookingById(bookingId: number) {
    const booking = await this.prisma.bookings.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Không tìm thấy booking');
    return {
      message: 'Lấy booking thành công',
      data: booking,
    };
  }
  async getBookingsByUser(userId: number, query: BookingQueryDto) {
    await this.checkBookingExist(userId);
    const result = await buildQueryPrisma({
      prismaModel: this.prisma.bookings,
      query,
      where: { userId },
      include: {
        Rooms: true,
        Users: { select: this.userSelect },
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      message: 'Lấy danh sách booking của user thành công',
      ...result,
    };
  }

  //owner/admin
  async getBookingsForCalendar(roomId: number, month: number, year: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    const bookings = await this.prisma.bookings.findMany({
      where: this.bookingOverlapWhere(roomId, start, end),
      orderBy: { checkIn: 'asc' },
    });
    if (bookings.length === 0) {
      throw new NotFoundException(
        'Không tìm thấy booking trong tháng được chỉ định',
      );
    }

    return {
      message: 'Lấy danh sách booking cho lịch thành công',
      data: bookings,
      total: bookings.length,
    };
  }
}
