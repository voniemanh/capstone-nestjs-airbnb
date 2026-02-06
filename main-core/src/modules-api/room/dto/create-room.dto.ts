import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  locationId!: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  guestCount?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  bedroomCount?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  bedCount?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  bathroomCount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsBoolean()
  hasWashingMachine?: boolean;

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
