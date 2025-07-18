import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Theater } from './theater.entity';

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
}
