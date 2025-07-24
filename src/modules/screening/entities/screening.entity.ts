import { ColumnNumberTransformer } from 'src/common/utils/ColumnNumberTransformer';
import { Movie } from 'src/modules/movie/entities/movie.entity';
import { Theater } from 'src/modules/theater/entities/theater.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SeatReservation } from './seat_reservation.entity';

@Entity()
export class Screening {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'int', nullable: false })
  public startTime: number;

  @Column({ type: 'int', nullable: false })
  public endTime: number;

  @Column({ type: 'int', nullable: false })
  public price: number;

  @Column({ type: 'boolean', nullable: false, default: true })
  public active: boolean;

  @ManyToOne(() => Movie, (movie) => movie.screenings)
  public movie: Movie;

  @ManyToOne(() => Theater, (theater) => theater.screenings)
  public theater: Theater;

  @OneToMany(
    () => SeatReservation,
    (seatReservations) => seatReservations.screening,
    { cascade: true },
  )
  public seatReservations: SeatReservation[];

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
