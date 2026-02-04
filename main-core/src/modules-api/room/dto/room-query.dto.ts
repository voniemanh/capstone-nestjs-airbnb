import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PagingDto } from 'src/common/dto/paging.dto';

export class RoomQueryDto extends PagingDto {
  // ===== STRING =====
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  // ===== NUMBER =====
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @Type(() => Number)
  guestCount?: number;

  @IsOptional()
  @Type(() => Number)
  bedroomCount?: number;

  @IsOptional()
  @Type(() => Number)
  bedCount?: number;

  @IsOptional()
  @Type(() => Number)
  bathroomCount?: number;

  @IsOptional()
  @Type(() => Number)
  locationId?: number;

  @IsOptional()
  @Type(() => Number)
  userId?: number;

  // ===== BOOLEAN =====
  @IsOptional()
  @Type(() => Boolean)
  hasIron?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  hasTV?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  hasAC?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  hasWifi?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  hasKitchen?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  hasParking?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  hasPool?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  hasHeater?: boolean;
}
