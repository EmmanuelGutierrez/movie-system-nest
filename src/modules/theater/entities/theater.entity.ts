import { Cinema } from 'src/modules/cinema/entities/cinema.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Seat } from './seat.entity';

@Entity()
export class Theater {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', nullable: false })
  public name: string;
  @Column({ type: 'varchar', nullable: false })
  public feature: string;

  @Column({ type: 'int', nullable: false })
  public rows: number;

  @Column({ type: 'int', nullable: false })
  public seatsPerRow: number;

  @OneToMany(() => Seat, (seat) => seat.theater)
  public seats: Seat[];

  @ManyToOne(() => Cinema, (cinema) => cinema.theaters)
  public cinema: Cinema;
}
