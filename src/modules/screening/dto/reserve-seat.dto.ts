import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { statusSeat } from 'src/common/constants/enum/seat-status.enum';

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
  @IsEnum(statusSeat)
  status!: statusSeat;
}
