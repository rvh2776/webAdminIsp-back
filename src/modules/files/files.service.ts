import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../common/cloudinary.service';

@Injectable()
export class FilesService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadImages(file: Express.Multer.File, folder: string) {
    // return 'Endpoint Cloudinary';
    return await this.cloudinaryService.uploadImage(file, folder);
  }
}
