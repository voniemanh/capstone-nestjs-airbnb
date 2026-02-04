import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { DATABASE_URL } from 'src/common/constant/app.constant';

@Injectable()
export class PrismaService extends PrismaClient {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const url = new URL(DATABASE_URL as string);

    const adapter = new PrismaMariaDb({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1),
      port: Number(url.port),
      connectionLimit: 5,
      allowPublicKeyRetrieval: true,
      // logger: {
      //   network: (info) => {
      //     this.logger.log('PrismaAdapterNetwork', info);
      //   },
      //   query: (info) => {
      //     this.logger.log('PrismaAdapterQuery', info);
      //   },
      //   error: (error) => {
      //     this.logger.error('PrismaAdapterError', error);
      //   },
      //   warning: (info) => {
      //     this.logger.warn('PrismaAdapterWarning', info);
      //   },
      // },
    });

    super({ adapter });
  }
}
