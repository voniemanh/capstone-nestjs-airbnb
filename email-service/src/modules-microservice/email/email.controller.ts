import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern('send_email')
  create(@Payload() createEmailDto: CreateEmailDto) {
    return this.emailService.create(createEmailDto);
  }
}
