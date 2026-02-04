import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
  @IsOptional()
  @IsString()
  phone?: string;
  @IsOptional()
  @IsString()
  avatar?: string;
  @IsOptional()
  @IsString()
  gender?: string;
  @IsOptional()
  @IsDateString()
  birthday?: string;
}
