import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { statusSeat } from 'src/common/enum/seat-status.enum';

export class SeatPosition {
  @IsNotEmpty()
  @IsNumber()
  row!: number;

  @IsNotEmpty()
  @IsNumber()
  number!: number;
}

export class UpdateSeatDto {
  @IsArray()
  @ValidateNested()
  @ArrayMinSize(1)
  @Type(() => SeatPosition)
  seatsPosition!: SeatPosition[];

  @IsNotEmpty()
  @IsNumber()
  screeningId!: number;

  @IsNotEmpty()
  @IsEnum(statusSeat)
  status!: statusSeat;
}
