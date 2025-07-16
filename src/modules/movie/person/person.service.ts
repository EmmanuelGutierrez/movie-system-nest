import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person) private readonly personRepo: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    const exist = await this.personRepo.exists({
      where: {
        name: createPersonDto.name.toLocaleLowerCase(),
      },
    });
    if (exist) {
      throw new ConflictException('Person already exist');
    }

    const newPerson = this.personRepo.create(createPersonDto);
    return await this.personRepo.save(newPerson);
  }

  async findAll() {
    return await this.personRepo.find();
  }

  async findByIds(ids: number[]) {
    return await this.personRepo.find({ where: { id: In(ids) } });
  }

  async findByNameAndLastName(name: string) {
    return await this.personRepo.findOne({ where: { name } });
  }

  async findOne(id: number) {
    const person = await this.personRepo.findOne({ where: { id } });
    if (!person) {
      throw new NotFoundException();
    }
    return person;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    const person = await this.findOne(id);
    this.personRepo.merge(person, updatePersonDto);
    await this.personRepo.save(person);
    return person;
  }

  async remove(id: number) {
    const person = await this.findOne(id);
    const res = await this.personRepo.delete(person.id);
    return res;
  }
}
