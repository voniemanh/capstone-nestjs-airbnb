import { Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import cloudinary from 'src/common/cloudinary/init.cloudinary';

@Injectable()
export class CloudinaryService {
  uploadImage(buffer: Buffer, folder: string) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder }, (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed'));
          resolve(result);
        })
        .end(buffer);
    });
  }

  deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
