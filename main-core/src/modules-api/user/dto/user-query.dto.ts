import { IsEnum, IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { PagingDto } from 'src/common/dto/paging.dto';
import { UserRole } from 'src/common/enum/user-role.enum';
export class UserQueryDto extends PagingDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;
}
