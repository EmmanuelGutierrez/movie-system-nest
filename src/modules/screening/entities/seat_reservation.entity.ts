import { statusSeat } from 'src/common/constants/enum/seat-status.enum';
import { ColumnNumberTransformer } from 'src/common/utils/ColumnNumberTransformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Screening } from './screening.entity';
import { Seat } from 'src/modules/theater/entities/seat.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity()
export class SeatReservation {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ enum: statusSeat, default: statusSeat.AVAILABLE })
  public status: statusSeat;

  @ManyToOne(() => Screening, (screening) => screening.seatReservations)
  public screening: Screening;

  @ManyToOne(() => Seat, (seat) => seat.seatReservations)
  public seat: Seat;

  @ManyToOne(() => User, (user) => user.seatReservations, { nullable: true })
  public user: User;

  @Column({
    type: 'bigint',
    transformer: new ColumnNumberTransformer(true),
  })
  createdAt: number;

  @Column({
    type: 'bigint',
    transformer: new ColumnNumberTransformer(true),
  })
  updatedAt: number;

  @BeforeInsert()
  setCreatedAt() {
    const now = Math.floor(new Date().getTime() / 1000);
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  setUpdatedAt() {
    const now = Math.floor(new Date().getTime() / 1000);
    this.createdAt = now;
    this.updatedAt = now;
  }
}
