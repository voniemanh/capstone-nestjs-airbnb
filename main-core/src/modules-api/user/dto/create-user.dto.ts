import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from 'src/common/enum/user-role.enum';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsDate()
  birthday?: string;
}
