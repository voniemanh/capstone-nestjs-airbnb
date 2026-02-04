import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên location không được để trống' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Thành phố không được để trống' })
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'Quốc gia không được để trống' })
  country: string;

  @IsString()
  @IsOptional()
  description?: string;
}
