import { Invoice } from 'src/modules/invoice/entities/invoice.entity';
import { Screening } from '../entities/screening.entity';
import { SeatReservation } from '../entities/seat_reservation.entity';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReserveSeatsRes {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Invoice)
  invoice: Invoice;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Screening)
  screening: Screening;

  @ApiProperty({ type: [SeatReservation] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => SeatReservation)
  seatReservations: SeatReservation[];
}
