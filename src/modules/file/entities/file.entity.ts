import { ColumnNumberTransformer } from 'src/common/utils/ColumnNumberTransformer';
import { Movie } from 'src/modules/movie/entities/movie.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', nullable: true })
  public asset_id?: string;

  @Column({ type: 'varchar', nullable: true })
  public public_id: string;

  @Column({ type: 'varchar', nullable: false })
  public format: string;

  @Column({ type: 'varchar', nullable: true })
  public resource_type: string;

  @Column({ type: 'varchar', nullable: true })
  public bytes: number;

  @Column({ type: 'varchar', nullable: true })
  public url: string;

  @Column({ type: 'varchar', nullable: true })
  public secure_url: string;

  @Column({ type: 'varchar', nullable: true })
  public folder: string;

  @Column({ type: 'varchar', nullable: false })
  public original_filename: string;

  @ManyToOne(() => Movie, (movie) => movie.photos, {
    nullable: true,
  })
  public movie: Movie;

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
