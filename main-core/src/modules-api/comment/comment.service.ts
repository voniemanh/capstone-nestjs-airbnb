import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PagingDto } from 'src/common/dto/paging.dto';
import { buildQueryPrisma } from 'src/common/helper/build-query-prisma.helper';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}
  //config
  private userSelect = {
    id: true,
    name: true,
    avatar: true,
  };
  //Validation
  private validateContent(content: string) {
    const trimmedContent = content?.trim();
    if (!trimmedContent) {
      throw new BadRequestException('Content không được để trống');
    }
    if (trimmedContent.length > 200) {
      throw new BadRequestException('Content quá dài, tối đa 200 ký tự');
    }
    return trimmedContent;
  }

  private async checkRoomExist(roomId: number) {
    const room = await this.prisma.rooms.findUnique({
      where: { id: roomId },
    });
    if (!room || room.isDeleted) {
      throw new BadRequestException('Room không tồn tại');
    }
    return room;
  }

  private async checkCommentExist(commentId: number) {
    const comment = await this.prisma.comments.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.isDeleted) {
      throw new NotFoundException(`Comment #${commentId} not found`);
    }

    return comment;
  }

  private checkEmtyCommentList(comments: any[]) {
    if (comments.length === 0) {
      throw new NotFoundException('Không tìm thấy comment nào');
    }
  }

  //PUBLIC
  async createComment(body: CreateCommentDto, userId: number) {
    const { roomId, content } = body;
    await this.checkRoomExist(roomId);

    // tạo comment
    const newComment = await this.prisma.comments.create({
      data: {
        content: this.validateContent(content),
        roomId,
        userId,
      },
      include: {
        Users: {
          select: this.userSelect,
        },
      },
    });

    return {
      message: 'Tạo comment thành công',
      data: newComment,
    };
  }

  async findCommentByRoomId(roomId: number, query: PagingDto) {
    await this.checkRoomExist(roomId);
    const result = await buildQueryPrisma({
      prismaModel: this.prisma.comments,
      pagingQuery: query,
      baseWhere: { roomId, isDeleted: false },
      include: {
        Users: {
          select: this.userSelect,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    this.checkEmtyCommentList(result.data);

    return {
      message: 'Lấy danh sách comment theo roomId thành công',
      ...result,
    };
  }

  async findCommentByUserId(userId: number, query: PagingDto) {
    const result = await buildQueryPrisma({
      prismaModel: this.prisma.comments,
      pagingQuery: query,
      baseWhere: { userId, isDeleted: false },
      include: {
        Users: {
          select: this.userSelect,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    this.checkEmtyCommentList(result.data);

    return {
      message: 'Lấy danh sách comment theo userId thành công',
      ...result,
    };
  }
  //OWNER
  async updateComment(id: number, body: UpdateCommentDto, user: any) {
    const { content } = body;
    const comment = await this.checkCommentExist(id);
    if (comment.userId !== user.id) {
      throw new ForbiddenException('Không có quyền chỉnh sửa comment này');
    }

    const updatedComment = await this.prisma.comments.update({
      where: { id },
      data: {
        content: this.validateContent(content),
      },
      include: {
        Users: {
          select: this.userSelect,
        },
      },
    });

    return {
      message: 'Cập nhật comment thành công',
      data: updatedComment,
    };
  }

  //ADMIN or OWNER
  async removeComment(id: number, user: any) {
    const comment = await this.checkCommentExist(id);
    const isOwner = comment.userId === user.id;
    const isAdmin = user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Không có quyền thực hiện hành động này');
    }

    await this.prisma.comments.update({
      where: { id },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    });

    return {
      message: 'Xoá comment thành công',
    };
  }
}
