import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  locationId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  guestCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  bedroomCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  bedCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  bathroomCount?: number;

  @IsOptional()
  @IsString()
  description?: string;

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
