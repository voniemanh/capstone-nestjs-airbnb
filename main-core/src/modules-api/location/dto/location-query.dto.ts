import { IsOptional, IsString } from 'class-validator';
import { PagingDto } from 'src/common/dto/paging.dto';

export class LocationQueryDto extends PagingDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
