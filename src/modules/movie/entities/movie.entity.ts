// import { movieGenres } from 'src/common/constants/enum/genres.enum';
import { ColumnNumberTransformer } from 'src/common/utils/ColumnNumberTransformer';
import { File } from 'src/modules/file/entities/file.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genre } from '../genre/entities/genre.entity';
import { Person } from '../person/entities/person.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', nullable: false })
  public name: string;

  @Column({ type: 'text', nullable: false })
  public description: string;

  // @Column({ type: 'enum', enum: movieGenres, nullable: false, array: true })
  @ManyToMany(() => Genre)
  @JoinTable()
  public genres: Genre[];

  // @Column({ type: 'varchar', nullable: false, array: true })
  @ManyToMany(() => Person, { nullable: true })
  @JoinTable()
  public actors?: Person[];

  @ManyToMany(() => Person, { nullable: true })
  @JoinTable()
  public directors?: Person[];

  @Column({ type: 'int', nullable: false })
  public duration: number;

  @Column({ type: 'bigint', nullable: false })
  public release: number;

  // @Column({ type: '', nullable: false })
  @OneToOne(() => File, { nullable: true, cascade: true, eager: true })
  @JoinColumn()
  public poster?: File;

  // @Column({ type: '', nullable: false })
  @OneToMany(() => File, (file) => file.movie, {
    nullable: true,
    cascade: true,
  })
  public photos?: File[];

  @Column({ type: 'boolean', default: false })
  public active: boolean;

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
