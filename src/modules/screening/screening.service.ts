import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';
import { SeatReservation } from './entities/seat_reservation.entity';
import { MovieService } from '../movie/movie.service';
import { TheaterService } from '../theater/theater.service';
import { roundedTime } from 'src/common/utils/roundedTime';
import { Screening } from './entities/screening.entity';
import { FilterScreeningDto } from './dto/filter.dto';
import { ScreeningGetaway } from './screening.gateway';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { statusSeat } from 'src/common/constants/enum/seat-status.enum';
import { screeningKey } from 'src/common/utils/cache-keys/screening-key';
import { SeatReserveDto } from './dto/reserve-seat.dto';
import { RedisService } from '../redis/redis.service';
import { Lock } from 'redlock';
import { IoReserveSeat } from 'src/common/constants/interface/ioReserveSeat.interface';

@Injectable()
export class ScreeningService {
  // private readonly suscriber: Redis;
  constructor(
    @InjectRepository(Screening)
    private readonly screeningRepo: Repository<Screening>,
    @InjectRepository(SeatReservation)
    private readonly seatReservationRepo: Repository<SeatReservation>,
    private readonly movieService: MovieService,
    private readonly theaterService: TheaterService,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly screeningGateway: ScreeningGetaway,
    private readonly redisService: RedisService,
    // @Inject('REDIS')
    // private readonly redisProvider: Redis,
  ) {
    // const suscriber = this.redisProvider.duplicate();
    // const suscriber = this.redisService.getSuscriber();
    // suscriber
    //   .psubscribe('__keyevent@1__:expired', (err, count) =>
    //     console.log('key expired', err, count),
    //   )
    //   .then(() => {
    //     console.log('suscriber ready');
    //   });
    // console.log('suscriber', suscriber);
    // suscriber.on('pmessage', (pattern, channel, message) => {
    //   console.log('pmessage', pattern, channel, message);
    // });
  }

  async createScreening({
    movieId,
    theaterId,
    startTime,
    ...data
  }: CreateScreeningDto) {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      // const existScreening = await this.userModel.exists({ email: data.email });
      // if (existScreening) {
      //   throw new HttpException('user exist', 400);
      // }

      const movie = await this.movieService.getOneById(movieId);
      const theater = await this.theaterService.getOneById(theaterId);
      const endTime = roundedTime(startTime, movie.duration);
      const exist = await this.existBetweenTime(startTime, endTime, theaterId);
      console.log(exist);
      if (exist) {
        throw new ConflictException();
      }
      const screening = qr.manager.create(Screening, {
        movie,
        endTime,
        startTime,
        theater,
        ...data,
      });

      const newScreening = await qr.manager.save(screening);
      const seatReservations: SeatReservation[] = [];
      for (const seat of theater.seats) {
        seatReservations.push(this.seatReservationRepo.create({ seat }));
      }

      qr.manager.merge(Screening, newScreening, {
        seatReservations,
      });
      const res = await qr.manager.save(newScreening);
      await qr.commitTransaction();
      return res;
    } catch (error: any) {
      await qr.rollbackTransaction();
      console.log(error);
      throw new HttpException(error.response as object, error.status as number);
    } finally {
      await qr.release();
    }
  }

  async getOneById(id: number) {
    const screening = await this.screeningRepo.findOne({ where: { id: id } });
    if (!screening) {
      throw new NotFoundException('Not found');
    }
    return screening;
  }

  async getAll(params: FilterScreeningDto) {
    const { page = 1, name, startTime, limit = 10 } = params;
    // this.screeningGateway.emitToScreening('1', '2');
    const qb = this.screeningRepo
      .createQueryBuilder('screening')
      .leftJoinAndSelect('screening.seatReservations', 'seatReservations')
      .leftJoinAndSelect('screening.movie', 'movie');
    /* 
      .createQueryBuilder('screening')
      .leftJoinAndSelect(
        SeatReservation,
        'seatReservation',
        'seatReservation.screening = screening.id',
      )
      .leftJoinAndSelect(Movie, 'movie', 'movie.id = screening.movieId');
       */
    qb.where('movie.active = :active', { active: true });
    if (name) {
      qb.andWhere('movie.name LIKE :name', {
        name: `%${name}%`,
      });
    }
    // if (genres && genres.length) {
    //   qb.andWhere('screening.name IN (:...genres)', { genres });
    // }

    if (startTime) {
      qb.andWhere('screening.startTime = :startTime', {
        startTime: startTime,
      });
    }
    qb.skip((page - 1) * limit).take(limit);
    const total = await this.screeningRepo.count();
    console.log('qr', qb.getQuery());
    console.log('params', qb.getParameters());
    const movies = await qb.getMany();
    return { page, inThisPage: movies.length, total, data: movies };
  }

  async getOneSeatReservation(seatReservationId: number) {
    const seatReservation = await this.seatReservationRepo.findOne({
      where: { id: seatReservationId },
    });
    if (!seatReservation) {
      throw new NotFoundException('Seat reservation not found');
    }
    return seatReservation;
  }

  async existBetweenTime(
    startTime: number,
    endTime: number,
    theaterId: number,
  ) {
    // const exist = await this.screeningModel.findOne({
    //   theater: theaterId,
    //   $or: [
    //     {
    //       startTime: { $gte: startTime, $lte: endTime },
    //     },
    //     {
    //       startTime: { $lte: startTime, $gte: endTime },
    //     },
    //     {
    //       endTime: { $gte: startTime, $lte: endTime },
    //     },
    //   ],
    // });

    const exist = await this.screeningRepo.findOne({
      where: [
        { startTime: Between(startTime, endTime), theater: { id: theaterId } },
        { endTime: Between(endTime, startTime), theater: { id: theaterId } },
        { startTime: Between(endTime, startTime), theater: { id: theaterId } },
      ],
    });

    return exist;
  }

  async getScreeningSeats(screeningId: number) {
    const seats = await this.seatReservationRepo.find({
      where: { screening: { id: screeningId } },
      relations: { seat: true },
    });
    if (!seats) {
      throw new NotFoundException('Screening not found');
    }
    return seats;
  }

  async getScreeningOneSeat(screeningId: number, row: number, number: number) {
    const seat = await this.seatReservationRepo.findOne({
      where: { seat: { row, number }, screening: { id: screeningId } },
    });
    if (!seat) {
      throw new NotFoundException('Screening not found');
    }
    return seat;
  }

  async updateSeat({ seatsPosition, screeningId, status }: UpdateSeatDto) {
    console.log('UPDATE');
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      for (const position of seatsPosition) {
        console.log('posititon', position);
        await qr.manager
          .createQueryBuilder()
          .update(SeatReservation)
          .set({ status })
          .where(
            (subqr) => {
              const subQuery = subqr
                .select('seat.id')
                .from('seat', 'seat')
                .where('seat.row = :row')
                .andWhere('seat.number = :number')
                .getQuery();
              return `seat_reservation."screeningId" = :screeningId and seat_reservation."seatId" IN (${subQuery})`;
            },
            { screeningId, row: position.row, number: position.number },
          )
          .execute();
      }

      await qr.commitTransaction();
    } catch (error) {
      console.log(error);
      await qr.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await qr.release();
    }
  }

  async temporarilyReserveSeat(
    data: {
      screeningId: number;
      seatReservationId: number;
      status: statusSeat;
      temporalTransactionId: string;
    },
    userId: number,
  ) {
    const { seatReservationId, screeningId, status, temporalTransactionId } =
      data;
    const cacheKey = screeningKey(
      screeningId,
      seatReservationId,
      userId,
      temporalTransactionId,
    );
    let seat: SeatReservation | null =
      await this.redisService.get<SeatReservation>(cacheKey);
    if (!seat) {
      seat = await this.getOneSeatReservation(seatReservationId);
      await this.redisService.set(cacheKey, seat, 30);
    }
    if (seat.status !== statusSeat.AVAILABLE) {
      throw new ConflictException(`Seat ${seat.id} is not available`);
    }
    return await this.updateSeat({
      screeningId,
      status,
      seatsPosition: [{ number: seat.seat.number, row: seat.seat.row }],
    });
  }

  async getReservedSeats(screeningId: number) {
    const indexKey = `screening:${screeningId}:seatreservation:index`;
    const keys = await this.redisService.smembers<string>(indexKey);
    if (!keys || keys.length === 0) {
      return [];
    }
    console.log('KEYS getReservedSeats', keys);
    const seatReservations =
      await this.redisService.mget<SeatReservation>(keys);
    if (!seatReservations || seatReservations.length === 0) {
      return [];
    }
    return seatReservations;
  }

  async temporarilyReserveGroupSeat(data: SeatReserveDto, userId: number) {
    const { seatReserve, screeningId, temporalTransactionId } = data;
    const locks: Lock[] = [];
    const indexKey = `screening:${screeningId}:seatreservation:index`;
    try {
      for (const seat of seatReserve) {
        const lockKey = `screening:${screeningId}:seatreservation:${seat.seatReservationId}`;
        const lock = await this.redisService.acquireLock(lockKey, 2000);
        const key = screeningKey(
          screeningId,
          seat.seatReservationId,
          userId,
          temporalTransactionId,
        );
        let seatReservation: SeatReservation | null =
          await this.redisService.get<SeatReservation>(key);
        if (!seatReservation) {
          seatReservation = await this.getOneSeatReservation(
            seat.seatReservationId,
          );
        }
        if (seatReservation.status !== statusSeat.AVAILABLE) {
          console.log('THROW');
          throw new ConflictException(
            `Seat ${seatReservation.id} is not available`,
          );
        }
        console.log('SIGUE');
        seatReservation.status = statusSeat.TEMPORARILY_RESERVED;
        await this.redisService.set(key, seatReservation, 30);
        await this.redisService.sadd(indexKey, key);
        const payload: IoReserveSeat = {
          status: seatReservation.status,
          seatReservationId: seatReservation.id,
          screeningId,
          // seatId: seatReservation.seat.id,
        };
        this.screeningGateway.emitToScreening(screeningId.toString(), payload);
        locks.push(lock);
      }
      return {
        success: true,
        message: 'Seats temporarily reserved successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response as object, error.status as number);
    } finally {
      for (const lock of locks) {
        await this.redisService
          .releaseLock(lock)
          .catch((err) => console.log(err));
      }
    }
  }

  notifySeatReservationExpired(seatReservationId: number, screeningId: number) {
    const payload: IoReserveSeat = {
      status: statusSeat.AVAILABLE,
      seatReservationId,
      screeningId,
    };

    this.screeningGateway.emitToScreening(screeningId.toString(), payload);
  }

  async reserveSeats(data: SeatReserveDto, userId: number) {
    const qr = this.dataSource.createQueryRunner();
    await qr.startTransaction();

    try {
      const { seatReserve, screeningId, temporalTransactionId } = data;
      const redisKeys = seatReserve.map((sr) =>
        screeningKey(
          screeningId,
          sr.seatReservationId,
          userId,
          temporalTransactionId,
        ),
      );
      console.log('KEYS reserveSeats', redisKeys);
      const seatReservations =
        await this.redisService.mget<SeatReservation>(redisKeys);
      console.log('LENGTH', seatReservations.length, seatReserve.length);
      if (seatReservations.length !== seatReserve.length) {
        throw new ConflictException('Invalid seat reservation data');
      }
      const seatReservationIds = seatReserve.map((sr) => sr.seatReservationId);
      console.log('SEATS', seatReservationIds);
      await qr.manager
        .createQueryBuilder()
        .update(SeatReservation)
        .set({
          status: statusSeat.OCCUPIED,
          user: { id: userId },
        })
        .where('screeningId = :screeningId', { screeningId })
        .andWhere('id IN (:...seatsId)', { seatsId: seatReservationIds })
        .execute();

      await this.redisService.del(...redisKeys);
      const payload: IoReserveSeat[] = seatReservations.map((sr) => ({
        screeningId,
        seatReservationId: sr.id,
        status: statusSeat.OCCUPIED,
      }));
      this.screeningGateway.emitToScreening(screeningId.toString(), payload);
      await qr.commitTransaction();
      console.log('Seats reserved successfully');
      return { success: true, message: 'Seats reserved successfully' };
    } catch (error: any) {
      console.log(error);
      await qr.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await qr.release();
    }
  }
}
