import multer from 'multer';
import { UnsupportedMediaTypeException } from '@nestjs/common';

export const memoryStorage = multer.memoryStorage();

export const imageMulterOptions: multer.Options = {
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(null, false);
    }
    cb(null, true);
  },
};
