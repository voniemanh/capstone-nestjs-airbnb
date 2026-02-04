import { IsNumber, IsEmail, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateEmailDto {
  @IsOptional()
  @IsNumber()
  bookingId?: number;

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsDateString()
  checkIn?: Date;

  @IsOptional()
  @IsDateString()
  checkOut?: Date;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
