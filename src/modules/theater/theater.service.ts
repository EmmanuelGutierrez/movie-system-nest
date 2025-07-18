import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, ILike, Repository } from 'typeorm';
import { Theater } from './entities/theater.entity';
import { CinemaService } from '../cinema/cinema.service';
import { Seat } from './entities/seat.entity';
import { FilterTheaterDto } from './dto/filter.dto';

@Injectable()
export class TheaterService {
  constructor(
    @InjectRepository(Theater)
    private readonly theaterRepo: Repository<Theater>,
    @InjectRepository(Seat)
    private readonly seatRepo: Repository<Seat>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly cinemaService: CinemaService,
  ) {}

  async createTheater({
    rows,
    seatsPerRow,
    cinemaId,
    ...data
  }: CreateTheaterDto) {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const cinema = await this.cinemaService.getOneById(cinemaId);

      const theater = this.theaterRepo.create({
        rows,
        seatsPerRow,
        cinema,
        ...data,
      });

      const newTheater = await this.dataSource.manager.save(theater);
      const layout: Seat[] = [];
      for (let row = 1; row < rows + 1; row++) {
        for (let col = 1; col < seatsPerRow + 1; col++) {
          layout.push(
            this.seatRepo.create({ row, number: col, theater: newTheater }),
          );
        }
      }
      this.theaterRepo.merge(newTheater, { seats: layout });

      return await this.dataSource.manager.save(theater);
    } catch (error: any) {
      console.log(error);
      await qr.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await qr.release();
    }
  }

  async getOneById(id: number) {
    const theater = await this.theaterRepo.findOne({ where: { id } });
    if (!theater) {
      throw new NotFoundException('Not found');
    }
    return theater;
  }

  async getAll(params: FilterTheaterDto) {
    const { limit = 10, page = 1, name, rows, seatsPerRow, cinemaId } = params;
    const options: FindManyOptions<Theater> = {
      take: limit,
      skip: (page - 1) * limit,
    };
    if (name) {
      options.where = {
        ...options.where,
        name: ILike(name),
      };
    }

    if (rows) {
      options.where = {
        ...options.where,
        rows: rows,
      };
    }

    if (seatsPerRow) {
      options.where = {
        ...options.where,
        seatsPerRow: seatsPerRow,
      };
    }

    if (cinemaId) {
      options.where = {
        ...options.where,
        cinema: { id: cinemaId },
      };
    }

    const theaters = await this.theaterRepo.find(options);
    const total = await this.theaterRepo.count();
    return { page, inThisPage: theaters.length, total, data: theaters };
  }
}
