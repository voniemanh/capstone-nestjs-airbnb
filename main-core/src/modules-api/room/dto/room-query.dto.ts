import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
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
  @IsBoolean()
  hasIron?: boolean;

  @IsOptional()
  @IsBoolean()
  hasTV?: boolean;

  @IsOptional()
  @IsBoolean()
  hasAC?: boolean;

  @IsOptional()
  @IsBoolean()
  hasWifi?: boolean;

  @IsOptional()
  @IsBoolean()
  hasKitchen?: boolean;

  @IsOptional()
  @IsBoolean()
  hasParking?: boolean;

  @IsOptional()
  @IsBoolean()
  hasPool?: boolean;

  @IsOptional()
  @IsBoolean()
  hasHeater?: boolean;
}
