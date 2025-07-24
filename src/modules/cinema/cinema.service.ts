import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Cinema } from './entities/cinema.entity';
import { DataSource, FindManyOptions, ILike, Repository } from 'typeorm';
import { FilterCinemaDto } from './dto/filter.dto';

@Injectable()
export class CinemaService {
  constructor(
    @InjectRepository(Cinema) private readonly cinemaRepo: Repository<Cinema>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async createCinema(data: CreateCinemaDto) {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      // const repo: Repository<Cinema> = this.dataSource.getRepository(Cinema);
      const newCinema = qr.manager.create(Cinema, data);

      const res = await qr.manager.save(newCinema);
      await qr.commitTransaction();
      return res;
    } catch (error: any) {
      console.log(error);
      await qr.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await qr.release();
    }
  }

  async update(cinemaId: number, data: UpdateCinemaDto) {
    // const res = await this.cinemaRepo.updateOne({ _id: cinemaId }, data);
    const cinema = await this.getOneById(cinemaId);
    this.cinemaRepo.merge(cinema, data);
    return cinema;
  }

  async getAll(params: FilterCinemaDto) {
    // const cinemas = await this.cinemaRepo.find();
    const { limit = 10, page = 1, location, name } = params;
    const options: FindManyOptions<Cinema> = {
      take: limit,
      skip: (page - 1) * limit,
    };
    if (name) {
      options.where = {
        ...options.where,
        name: ILike(name),
      };
    }

    if (location) {
      options.where = {
        ...options.where,
        location: ILike(location),
      };
    }
    const cinemas = await this.cinemaRepo.find(options);
    const total = await this.cinemaRepo.count();
    return { page, inThisPage: cinemas.length, total, data: cinemas };
  }

  async getOneById(id: number) {
    // const cinemas = await this.cinemaRepo.find();
    const cinema = await this.cinemaRepo.findOne({
      where: { id },
      relations: { theaters: true },
    });

    if (!cinema) {
      throw new NotFoundException('Not found');
    }
    return cinema;
  }
}
