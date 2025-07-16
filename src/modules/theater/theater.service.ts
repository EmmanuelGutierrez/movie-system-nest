import { Injectable } from '@nestjs/common';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';

@Injectable()
export class TheaterService {
  create(createTheaterDto: CreateTheaterDto) {
    return 'This action adds a new theater';
  }

  findAll() {
    return `This action returns all theater`;
  }

  findOne(id: number) {
    return `This action returns a #${id} theater`;
  }

  update(id: number, updateTheaterDto: UpdateTheaterDto) {
    return `This action updates a #${id} theater`;
  }

  remove(id: number) {
    return `This action removes a #${id} theater`;
  }
}
