import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
// import { CloudinaryResponse } from 'src/common/constants/types/CloudinaryResponse.type';
import { fileType } from 'src/common/constants/types/file.type';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadFileStream(
    file: Express.Multer.File,
    // external_id: string,
    folder?: string,
    resource_type?: fileType,
  ): Promise<UploadApiResponse | undefined> {
    return new Promise<UploadApiResponse | undefined>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type, /* public_id: external_id, */ folder },
        (error, result) => {
          if (error) {
            reject(new HttpException(error.message, error.http_code));
          }
          resolve(result);
        },
      );
      if (file && file.buffer) {
        Readable.from([file.buffer]).pipe(uploadStream);
      } else {
        reject(new Error('Invalid file or file buffer.'));
      }
    });
  }

  async deleteFile(public_id: string) {
    await cloudinary.uploader.destroy(public_id, (err, result) => {
      if (err) {
        throw new InternalServerErrorException();
      }
      console.log(result);
    });

    return {
      message: 'File deleted',
    };
  }

  async deleteFileMany(public_ids: string[]): Promise<any> {
    // const deleteFileData: any =
    //   await cloudinary.api.delete_resources(public_ids);
    // console.log('deleteFileData', deleteFileData);
    // return deleteFileData;
    await cloudinary.api.delete_resources(public_ids, (err, result) => {
      if (err) {
        throw new InternalServerErrorException();
      }
      console.log(result);
    });

    return {
      message: 'Files deleted',
    };
  }

  async uploadFileBase64(
    file: string,
    external_id: string,
    folder?: string,
    resource_type?: fileType,
  ) {
    try {
      console.log('cloud', external_id, folder, resource_type);
      const result = await cloudinary.uploader.upload(file, {
        resource_type: 'auto',
        folder,
        public_id: external_id,
        // overwrite: true,
        // invalidate: true,
        // crop: 'fill',
      });
      return result;
    } catch (error) {
      // console.log('Cloudinary error', error);
      // if((error as any).errno && (error as any).code)
      throw new Error(`Error: ${error.error.code}, code: ${error.error.errno}`);
    }
  }
}
