import { Exclude } from 'class-transformer';
import { roles } from 'src/common/enum/roles.enum';
import { ColumnNumberTransformer } from 'src/common/utils/ColumnNumberTransformer';
import { Invoice } from 'src/modules/invoice/entities/invoice.entity';
import { SeatReservation } from 'src/modules/screening/entities/seat_reservation.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    type: 'varchar',
    unique: true,
    transformer: {
      to(value: string) {
        if (typeof value === 'string') return value.toLowerCase();
        return value;
      },
      from(value: string) {
        return value;
      },
    },
  })
  public email!: string;

  @Exclude()
  @Column({ type: 'varchar', select: false })
  public password!: string;

  @Column({ type: 'varchar', nullable: true })
  public name: string | null;

  @Column({ type: 'varchar', nullable: false })
  public lastName: string | null;

  @Column({
    type: 'varchar',
    nullable: false,
    enum: roles,
    default: roles.USER,
  })
  public role: roles;

  @Column({ type: 'bigint', nullable: true, default: null })
  public lastLoginAt?: number | null;

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

  @OneToMany(() => SeatReservation, (seatReservations) => seatReservations.user)
  public seatReservations: SeatReservation[];

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  public invoices: Invoice[];
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
