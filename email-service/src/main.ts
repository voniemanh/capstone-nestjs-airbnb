import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RABBITMQ_URL } from './common/constant/app.constant';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL!],
        queue: 'email_queue',
        queueOptions: {
          durable: false, //false: khi rabbitmq trong docker restart se xoa het queue va tin nhan
        },
        socketOptions: {
          connectionOptions: {
            clientProperties: {
              connection_name: 'email-on',
            },
          },
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
