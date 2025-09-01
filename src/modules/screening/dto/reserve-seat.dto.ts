import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SeatReservationIdDto {
  @IsNotEmpty()
  @IsNumber()
  seatReservationId!: number;
}

export class SeatReserveTempDto {
  @IsArray()
  @ValidateNested()
  @ArrayMinSize(1)
  @Type(() => SeatReservationIdDto)
  seatReserve!: SeatReservationIdDto[];

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

export class SeatReserveDto extends SeatReserveTempDto {
  @IsNotEmpty()
  @IsString()
  preferenceId!: string;

  // @IsNotEmpty()
  // @IsEnum(statusSeat)
  // status!: statusSeat;
}
