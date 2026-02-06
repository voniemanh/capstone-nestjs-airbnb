import { Global, Inject, Module, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { RABBITMQ_URL } from 'src/common/constant/app.constant';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'email_queue',
          queueOptions: {
            durable: false, //false: khi rabbitmq trong docker restart se xoa het queue va tin nhan
          },
          socketOptions: {
            connectionOptions: {
              clientProperties: {
                connection_name: 'email-send',
              },
            },
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQModule implements OnModuleInit {
  constructor(@Inject('EMAIL_SERVICE') private emailClient: ClientProxy) {}
  async onModuleInit() {
    // kiểm tra kết nối
    try {
      await this.emailClient.connect();
      console.log('✅ Rabbit-MQ connected');
    } catch (error) {
      console.log('❌ Rabbit-MQ failed', error);
    }
  }
}
