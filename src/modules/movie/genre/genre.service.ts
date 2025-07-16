import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre) private readonly genreRepo: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    const exist = await this.genreRepo.exists({
      where: { name: createGenreDto.name.toLocaleLowerCase() },
    });
    if (exist) {
      throw new ConflictException('Genre already exist');
    }

    const newGenre = this.genreRepo.create(createGenreDto);
    return await this.genreRepo.save(newGenre);
  }

  async findAll() {
    return await this.genreRepo.find();
  }

  async findOne(id: number) {
    const genre = await this.genreRepo.findOne({ where: { id } });
    if (!genre) {
      throw new NotFoundException();
    }
    return genre;
  }

  async findByIds(ids: number[]) {
    return await this.genreRepo.find({ where: { id: In(ids) } });
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.findOne(id);
    this.genreRepo.merge(genre, updateGenreDto);
    await this.genreRepo.save(genre);
    return genre;
  }

  async remove(id: number) {
    const genre = await this.findOne(id);
    const res = await this.genreRepo.delete(genre.id);
    return res;
  }
}
