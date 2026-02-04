import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class SignupDto {
  @IsString({})
  @IsEmail({}, { message: 'email sai' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
