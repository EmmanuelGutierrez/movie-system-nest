import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { fileType } from 'src/common/constants/types/file.type';
import { CreateManyI } from './interfaces/CreateMany.interface';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File) private readonly fileRepo: Repository<File>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getAll() {
    const files = await this.fileRepo.find();
    return files;
  }

  async getOneById(id: number) {
    const file = await this.fileRepo.findOne({ where: { id } });

    if (!file) {
      throw new HttpException('Archivo no encontrado', 404);
    }

    return file;
  }
  async createBase64(
    fileData: string,
    // external_id: string,
    folder: string,
    type?: fileType,
  ) {
    const cloudinaryRes = await this.cloudinaryService.uploadFileBase64(
      fileData,
      // external_id,
      folder,
      type,
    );
    const file: File = this.fileRepo.create({
      bytes: cloudinaryRes.bytes,
      public_id: cloudinaryRes.public_id,
      format: cloudinaryRes.format,
      original_filename: cloudinaryRes.original_filename,
      resource_type: cloudinaryRes.resource_type,
      secure_url: cloudinaryRes.secure_url,
      url: cloudinaryRes.url,
      folder: cloudinaryRes.folder as string,
    });
    return file;
  }
  async create(fileData: Express.Multer.File, folder: string, type?: fileType) {
    const cloudinaryRes = await this.cloudinaryService.uploadFileStream(
      fileData,
      folder,
      type,
    );
    console.log('cloudinary res', cloudinaryRes);
    if (!cloudinaryRes) {
      throw new Error('No cloudinary response');
    }
    // const file: File = this.fileRepo.create({
    //   bytes: cloudinaryRes.bytes,
    //   public_id: cloudinaryRes.public_id,
    //   format: cloudinaryRes.format,
    //   original_filename: cloudinaryRes.original_filename,
    //   resource_type: cloudinaryRes.resource_type,
    //   secure_url: cloudinaryRes.secure_url,
    //   url: cloudinaryRes.url,
    //   folder: folder,
    // });
    // const cloudinaryRes = {
    //   asset_id: 'aec24eed681db279be468fcd705c1afd',
    //   public_id: 'movies/files/posters/clu9gux4p4u39t9dasha',
    //   version: 1752467527,
    //   version_id: 'fcf16c107f11f0c815958a6b8f1d81b0',
    //   signature: 'd2ae62503353db8554877f51c7d3a46766eb5632',
    //   width: 5120,
    //   height: 2880,
    //   format: 'jpg',
    //   resource_type: 'image',
    //   created_at: '2025-07-14T04:32:07Z',
    //   tags: [],
    //   bytes: 4531675,
    //   type: 'upload',
    //   etag: '47b28f887b4fceb229399053a5db31e2',
    //   placeholder: false,
    //   url: 'http://res.cloudinary.com/dcfnbbld6/image/upload/v1752467527/movies/files/posters/clu9gux4p4u39t9dasha.jpg',
    //   secure_url:
    //     'https://res.cloudinary.com/dcfnbbld6/image/upload/v1752467527/movies/files/posters/clu9gux4p4u39t9dasha.jpg',
    //   folder: 'movies/files/posters',
    //   original_filename: 'file',
    //   api_key: '162726714375486',
    // };
    const file: File = this.fileRepo.create({
      bytes: cloudinaryRes.bytes,
      public_id: cloudinaryRes.public_id,
      format: cloudinaryRes.format,
      original_filename: cloudinaryRes.original_filename,
      resource_type: cloudinaryRes.resource_type,
      secure_url: cloudinaryRes.secure_url,
      url: cloudinaryRes.url,
      folder: folder,
      asset_id: cloudinaryRes.asset_id as string | undefined,
    });
    return file;
  }

  async createMany({
    filesData,
    // external_id,
    folder,
    type,
    toBase64,
  }: CreateManyI) {
    const filesToUpload = filesData.map((file) => {
      if (toBase64) {
        const res = this.create(file as Express.Multer.File, folder, type);
        return res;
      } else {
        const res = this.createBase64(
          file as string,
          // external_id,
          folder,
          type,
        );
        return res;
      }
    });

    const resProm = await Promise.all(filesToUpload);
    console.log('resProm', resProm);
    return resProm;
  }

  async deleteFile(id: number) {
    const file = await this.getOneById(id);
    await this.cloudinaryService.deleteFile(file.public_id);
    const res = await this.fileRepo.delete(id);
    return res;
  }

  async deleteFileMany({
    public_ids,
    ids,
  }: {
    public_ids: string[];
    ids: number[];
  }) {
    await this.cloudinaryService.deleteFileMany(public_ids);
    const res = await this.fileRepo.delete(ids);
    return res;
  }
}
