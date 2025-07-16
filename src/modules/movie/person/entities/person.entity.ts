// import { PersonRole } from 'src/common/constants/enum/person-role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', nullable: false })
  public name!: string;

  //   @Column({ enum: PersonRole, default: PersonRole.ACTOR })
  //   public role: PersonRole;
}
