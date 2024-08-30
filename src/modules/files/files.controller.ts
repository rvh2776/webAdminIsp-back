import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auths/auth.guards';
import { ApiTags } from '@nestjs/swagger';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@ApiTags('Upload Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(AuthGuard)
  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('image'))
  getUploadImages(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
  ) {
    // return file;
    return this.filesService.uploadImages(file, folder);
  }
}
