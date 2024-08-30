import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { CloudinaryService } from 'src/common/cloudinary.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, CloudinaryConfig, CloudinaryService],
  exports: [],
})
export class FilesModule {}
