import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { buildQueryPrisma } from 'src/common/helper/build-query-prisma.helper';
import { CloudinaryService } from 'src/modules-system/upload/cloudinary.service';
import {
  CLOUDINARY_NAME,
  CLOUD_FOLDER_LOCATION,
} from 'src/common/constant/app.constant';
import { LocationQueryDto } from './dto/location-query.dto';

@Injectable()
export class LocationService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}
  private async checkExist(id: number) {
    const location = await this.prisma.locations.findUnique({
      where: { id },
    });

    if (!location || location.isDeleted) {
      throw new NotFoundException('Location không tồn tại');
    }

    return location;
  }

  private locationSelect = {
    id: true,
    name: true,
    city: true,
    country: true,
    imageUrl: true,
    createdAt: true,
  };

  async createLocation(data: CreateLocationDto) {
    const existLocation = await this.prisma.locations.findFirst({
      where: {
        name: data.name,
        isDeleted: false,
      },
    });

    if (existLocation) {
      throw new BadRequestException('Location đã tồn tại');
    }
    const createdLocation = await this.prisma.locations.create({
      data,
      select: this.locationSelect,
    });

    return {
      message: 'Tạo location thành công',
      data: createdLocation,
    };
  }

  async getListLocations(query: LocationQueryDto) {
    const result = await buildQueryPrisma({
      prismaModel: this.prisma.locations,
      pagingQuery: query,
      filters: query,
      fieldOptions: { string: ['name', 'city', 'country'] },
      baseWhere: { isDeleted: false },
      select: this.locationSelect,
      orderBy: { createdAt: 'asc' },
    });

    return {
      message: 'Lấy danh sách location thành công',
      ...result,
    };
  }

  async getLocationById(id: number) {
    const location = await this.prisma.locations.findUnique({
      where: { id },
      select: this.locationSelect,
    });

    if (!location) {
      throw new NotFoundException('Không tìm thấy location');
    }

    return {
      message: 'Lấy chi tiết location thành công',
      data: location,
    };
  }

  async updateLocation(id: number, data: UpdateLocationDto) {
    await this.checkExist(id);

    const updatedLocation = await this.prisma.locations.update({
      where: { id },
      data,
      select: this.locationSelect,
    });

    return {
      message: 'Cập nhật location thành công',
      data: updatedLocation,
    };
  }

  async removeLocation(id: number) {
    await this.checkExist(id);

    const deletedLocation = await this.prisma.locations.update({
      where: { id },
      data: { isDeleted: true },
      select: this.locationSelect,
    });

    return {
      message: 'Xoá location thành công',
      data: deletedLocation,
    };
  }

  async uploadLocationImage(id: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn ảnh');
    }
    // Kiểm tra location tồn tại
    const location = await this.prisma.locations.findUnique({
      where: { id },
    });
    if (!location || location.isDeleted) {
      throw new NotFoundException('Location không tồn tại');
    }

    // Upload avatar mới lên Cloudinary
    const uploadResult = await this.cloudinaryService.uploadImage(
      file.buffer,
      CLOUD_FOLDER_LOCATION,
    );
    // Update avatar mới vào DB
    await this.prisma.locations.update({
      where: { id },
      data: { imageUrl: uploadResult.public_id },
    });

    // Xoá avatar cũ (nếu có)
    if (location.imageUrl) {
      await this.cloudinaryService.deleteImage(location.imageUrl);
    }
    const imageUrl = `https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/${uploadResult.public_id}`;

    return {
      message: 'Upload ảnh location thành công',
      data: { imageUrl },
    };
  }
}
