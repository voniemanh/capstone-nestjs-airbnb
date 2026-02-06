import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { imageMulterOptions } from 'src/common/multer/multer.config';

export const UploadImageInterceptor = (fieldName = 'file') =>
  FileInterceptor(fieldName, imageMulterOptions as MulterOptions);
