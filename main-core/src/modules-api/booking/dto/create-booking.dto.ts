import { IsDate, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @Type(() => Number)
  @IsInt()
  roomId: number;

  @Type(() => Date)
  @IsDate()
  checkIn: Date;

  @Type(() => Date)
  @IsDate()
  checkOut: Date;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  guestCount: number;
}
