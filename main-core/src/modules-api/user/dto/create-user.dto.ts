import {
  IsDate,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsIn(['ADMIN', 'USER']) // chỉ cho phép 2 role
  role!: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;
}
