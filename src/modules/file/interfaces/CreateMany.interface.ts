import { fileType } from 'src/common/types/file.type';

export interface CreateManyI {
  filesData: Express.Multer.File[] | string[];
  // external_id: string;
  folder: string;
  type?: fileType;
  toBase64?: boolean;
}
