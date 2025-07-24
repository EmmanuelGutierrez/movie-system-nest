import { Cinema } from 'src/modules/cinema/entities/cinema.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Seat } from './seat.entity';
import { Screening } from 'src/modules/screening/entities/screening.entity';
import { ColumnNumberTransformer } from 'src/common/utils/ColumnNumberTransformer';

@Entity()
export class Theater {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', nullable: false })
  public name: string;
  @Column({ type: 'varchar', nullable: true })
  public feature: string;

  @Column({ type: 'int', nullable: false })
  public rows: number;

  @Column({ type: 'int', nullable: false })
  public seatsPerRow: number;

  @OneToMany(() => Seat, (seat) => seat.theater, { cascade: true })
  public seats: Seat[];

  @ManyToOne(() => Cinema, (cinema) => cinema.theaters)
  public cinema: Cinema;

  @OneToMany(() => Screening, (screening) => screening.theater)
  public screenings: Screening[];

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
