import { Module } from '@nestjs/common';
import { TheaterService } from './theater.service';
import { TheaterController } from './theater.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theater } from './entities/theater.entity';
import { Seat } from './entities/seat.entity';
import { CinemaModule } from '../cinema/cinema.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Theater]),
    TypeOrmModule.forFeature([Seat]),
    CinemaModule,
  ],
  controllers: [TheaterController],
  providers: [TheaterService],
})
export class TheaterModule {}
