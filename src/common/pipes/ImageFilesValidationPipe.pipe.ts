import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageFilesValidationPipe implements PipeTransform {
  transform(files: { [key: string]: Express.Multer.File[] }) {
    for (const key of Object.keys(files)) {
      const fileArray = files[key as keyof typeof files];
      if (Array.isArray(fileArray)) {
        for (const file of fileArray) {
          if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp|gif)$/)) {
            throw new BadRequestException(
              `Invalid file type: ${file.originalname}`,
            );
          }
          if (file.size > 5 * 1024 * 1024) {
            throw new BadRequestException(
              `File too large: ${file.originalname}`,
            );
          }
        }
      }
    }
    return files;
  }
}
