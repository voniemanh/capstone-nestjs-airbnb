import { FileInterceptor } from '@nestjs/platform-express';
import { imageMulterOptions } from 'src/common/multer/multer.config';

export const UploadImageInterceptor = (fieldName = 'file') =>
  FileInterceptor(fieldName, imageMulterOptions);
