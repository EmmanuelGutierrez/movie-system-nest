import { Screening } from 'src/modules/screening/entities/screening.entity';
import { SeatReservation } from 'src/modules/screening/entities/seat_reservation.entity';

export class CreateInvoiceDto {
  //   @IsNumber({}, { each: true })
  //   @IsNotEmpty()
  readonly seatReservations: SeatReservation[];

  readonly screening: Screening;

  readonly userId: number;

  readonly temporalTransactionId: string;
}
