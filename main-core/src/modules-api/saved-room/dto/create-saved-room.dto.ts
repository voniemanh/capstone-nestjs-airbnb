import { IsNumber } from 'class-validator';

export class CreateSavedRoomDto {
  @IsNumber()
  roomId: number;
}
