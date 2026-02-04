import { PartialType } from '@nestjs/mapped-types';
import { CreateSavedRoomDto } from './create-saved-room.dto';

export class UpdateSavedRoomDto extends PartialType(CreateSavedRoomDto) {}
