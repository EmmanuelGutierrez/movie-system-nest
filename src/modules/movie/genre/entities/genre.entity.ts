import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
    transformer: {
      to(value: string) {
        if (typeof value === 'string') return value.toLowerCase();
        return value;
      },
      from(value: string) {
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
    },
  })
  public name!: string;
}
