import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Theater } from './theater.entity';
import { SeatReservation } from 'src/modules/screening/entities/seat_reservation.entity';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'int', nullable: false })
  public row: number;

  @Column({ type: 'int', nullable: false })
  public number: number;

  @ManyToOne(() => Theater, (theater) => theater.seats)
  public theater: Theater;

  @OneToMany(() => SeatReservation, (seatReservations) => seatReservations.seat)
  public seatReservations: SeatReservation[];
}
