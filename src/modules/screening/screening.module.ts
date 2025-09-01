import { Module } from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { ScreeningController } from './screening.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Screening } from './entities/screening.entity';
import { SeatReservation } from './entities/seat_reservation.entity';
import { TheaterModule } from '../theater/theater.module';
import { MovieModule } from '../movie/movie.module';
import { ScreeningGetaway } from './screening.gateway';
import { RedisModule } from '../redis/redis.module';
import { ScreeningListenerService } from './screening-listener.service';
import { AuthModule } from '../auth/auth.module';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Screening]),
    TypeOrmModule.forFeature([SeatReservation]),
    TheaterModule,
    MovieModule,
    RedisModule,
    AuthModule,
    InvoiceModule,
  ],
  controllers: [ScreeningController],
  providers: [ScreeningService, ScreeningGetaway, ScreeningListenerService],
})
export class ScreeningModule {}
