import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Admin } from 'src/common/decorators/roles.decorator';
import { ProtectGuard } from 'src/common/guards/protect.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';

@UseGuards(ProtectGuard, RolesGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // ---------------------------
  // ADMIN ONLY
  // ---------------------------
  @Admin()
  @Get()
  async getAllBookings(@Query() query: BookingQueryDto) {
    return this.bookingService.getAllBookings(query);
  }

  @Admin()
  @Get('by-booking/:id')
  async getBookingByIdAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.getBookingById(id);
  }

  @Admin()
  @Get('by-user/:userId')
  async getBookingsByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: BookingQueryDto,
  ) {
    return this.bookingService.getBookingsByUser(userId, query);
  }

  @Admin()
  @Patch(':id/admin-cancel')
  async adminCancelBooking(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() admin,
  ) {
    return this.bookingService.adminCancelBooking(admin.id, id);
  }

  // ---------------------------
  // OWNER / CURRENT USER
  // ---------------------------
  @Get('me')
  async getMyBookings(@CurrentUser() user, @Query() query: BookingQueryDto) {
    return this.bookingService.getMyBookings(user.id, query);
  }

  @Get('me/by-booking/:id')
  async getBookingById(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const booking = await this.bookingService.getBookingById(id);
    if (booking.data.userId !== user.id)
      throw new ForbiddenException('Not your booking');
    return booking;
  }

  @Post()
  async createBooking(@CurrentUser() user, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(user.id, dto);
  }

  @Patch(':id/cancel')
  async cancelBooking(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookingService.cancelBooking(user.id, id);
  }

  // ---------------------------
  // PUBLIC
  // ---------------------------
  @Public()
  @Get('availability/:roomId')
  async getAvailability(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.bookingService.getAvailability(
      roomId,
      new Date(from),
      new Date(to),
    );
  }

  // ---------------------------
  // OWNER / ADMIN
  // ---------------------------
  @Get('calendar/:roomId')
  async getCalendar(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.bookingService.getBookingsForCalendar(roomId, month, year);
  }
}
