import { IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PagingDto } from 'src/common/dto/paging.dto';
import { BookingStatus } from 'src/common/enum/booking-status.enum';

export class BookingQueryDto extends PagingDto {
  @IsOptional()
  @Type(() => Number)
  roomId?: number;

  @IsOptional()
  @Type(() => Number)
  userId?: number;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
