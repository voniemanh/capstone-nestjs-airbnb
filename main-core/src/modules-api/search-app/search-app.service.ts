import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';

@Injectable()
export class SearchAppService implements OnModuleInit {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private prisma: PrismaService,
  ) {}

  async onModuleInit() {
    // ngoài init
    // mỗi table khi create, delete, update => update lại elastic
    this.initUser();
    this.initRooms();
    this.initLocations();
  }

  async searchApp(text: string) {
    const result = await this.elasticsearchService.search({
      index: ['users', 'rooms', 'locations'],
      ignore_unavailable: true,
      query: {
        multi_match: {
          query: text,
          fields: ['email', 'name', 'description', 'city', 'country'],
        },
      },
    });
    return result;
  }

  async initUser() {
    const index = 'users';
    await this.elasticsearchService.indices.delete({
      index: index, // giống với table trong mysql,
      ignore_unavailable: true, // nếu mà index chưa có thì không báo lỗi
    });

    const users = await this.prisma.users.findMany();

    users.forEach((user) => {
      this.elasticsearchService.index({
        index: index, // giống với table trong mysql
        id: String(user.id),
        document: user,
      });
    });
  }

  async initRooms() {
    const index = 'rooms';
    await this.elasticsearchService.indices.delete({
      index: index, // giống với table trong mysql,
      ignore_unavailable: true, // nếu mà index chưa có thì không báo lỗi
    });

    const rooms = await this.prisma.rooms.findMany();

    rooms.forEach((room) => {
      this.elasticsearchService.index({
        index: index, // giống với table trong mysql
        id: String(room.id),
        document: room,
      });
    });
  }

  async initLocations() {
    const index = 'locations';
    await this.elasticsearchService.indices.delete({
      index: index, // giống với table trong mysql,
      ignore_unavailable: true, // nếu mà index chưa có thì không báo looix
    });

    const locations = await this.prisma.locations.findMany();

    locations.forEach((location) => {
      this.elasticsearchService.index({
        index: index, // giống với table trong mysql
        id: String(location.id),
        document: location,
      });
    });
  }
}
