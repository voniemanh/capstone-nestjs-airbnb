import { IsInt, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  roomId: number;
  @IsString()
  content: string;
}
