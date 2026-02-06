import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class CreateCommentDto {
  @Type(() => Number)
  @IsInt()
  roomId!: number;

  @IsString()
  content!: string;
}
