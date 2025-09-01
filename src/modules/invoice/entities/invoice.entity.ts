import { Tax } from 'mercadopago/dist/clients/commonTypes';
import { ColumnNumberTransformer } from 'src/common/utils/ColumnNumberTransformer';
import { SeatReservation } from 'src/modules/screening/entities/seat_reservation.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UrlsDto } from '../dto/urls.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ColumnDecimalTransformer } from 'src/common/utils/ColumnDecimalTransformer';

@Entity()
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @OneToMany(
    () => SeatReservation,
    (seatReservation) => seatReservation.invoice,
  )
  seatReservations!: SeatReservation[];

  @ManyToOne(() => User, (user) => user.invoices, { nullable: false })
  user!: User;

  @Column({ type: 'varchar', nullable: true })
  additional_info?: string;

  @Column({ type: 'varchar', nullable: true })
  auto_return?: string;

  @Column({ type: 'varchar', nullable: true })
  client_id?: string;

  @Column({ type: 'int', nullable: true })
  collector_id?: number;

  @Column({ type: 'varchar', nullable: true })
  date_created?: string;

  @Column({ type: 'varchar', nullable: true })
  date_of_expiration?: string;

  @Column({ type: 'varchar', nullable: true })
  expiration_date_from?: string;

  @Column({ type: 'varchar', nullable: true })
  expiration_date_to?: string;

  @Column({ type: 'varchar', nullable: true })
  expires?: boolean;

  @Column({ type: 'varchar', nullable: true })
  external_id?: string;

  @Column({ type: 'varchar', nullable: true })
  init_point?: string;

  @Column({ type: 'int', nullable: true })
  marketplace_fee?: number;

  @Column({ type: 'varchar', nullable: true })
  notification_url?: string;

  @Column({ type: 'varchar', nullable: true })
  operation_type?: string;

  @ApiProperty({ type: () => UrlsDto, required: false })
  @Column({ type: 'simple-json', nullable: true })
  redirect_urls?: UrlsDto;

  @ApiProperty({ type: () => UrlsDto, required: false })
  @Column({ type: 'simple-json', nullable: true })
  back_urls?: UrlsDto;

  @Column({ type: 'varchar', nullable: true })
  site_id?: string;

  @Column({ nullable: true, type: 'jsonb' })
  taxes?: Array<Tax>;

  @Column({
    type: 'decimal',
    transformer: new ColumnDecimalTransformer(),
  })
  public total: number;

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
