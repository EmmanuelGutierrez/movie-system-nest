import { statusSeat } from '../enum/seat-status.enum';

export interface IoReserveSeat {
  status: statusSeat;
  seatReservationId: number;
  screeningId: number;
}
