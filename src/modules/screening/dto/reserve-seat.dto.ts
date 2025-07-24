import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SeatReservation {
  @IsNotEmpty()
  @IsNumber()
  seatReservationId!: number;
}

export class SeatReserveDto {
  @IsArray()
  @ValidateNested()
  @ArrayMinSize(1)
  @Type(() => SeatReservation)
  seatReserve!: SeatReservation[];

  @IsNotEmpty()
  @IsNumber()
  screeningId!: number;

  @IsNotEmpty()
  @IsString()
  temporalTransactionId!: string;

  // @IsNotEmpty()
  // @IsEnum(statusSeat)
  // status!: statusSeat;
}
