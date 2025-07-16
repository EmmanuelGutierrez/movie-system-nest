import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { roles } from 'src/common/constants/enum/roles.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly dataSourse: DataSource,
  ) {}

  async creatUser({ password, ...data }: CreateUserDto) {
    try {
      const existUser = await this.userRepo.exists({
        where: { email: data.email },
      });
      if (existUser) {
        throw new HttpException('user exist', 400);
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const user = this.userRepo.create({
        ...data,
        password: hashPassword,
        role: roles.USER,
      });

      const res = await this.userRepo.save(user);
      return res;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw new HttpException(
          error.message ?? 'Error',
          error.getStatus() ?? 500,
        );
      } else {
        throw new HttpException('Error', 500);
      }
    }
  }

  async getOneById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Not found');
    }
    return user;
  }

  async getOneByEmail(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Not found');
    }
    return user;
  }

  async getAll() {
    const user = await this.userRepo.find({});
    if (!user) {
      throw new NotFoundException('Not found');
    }
    return user;
  }

  public async getOneByEmailWithPassword(email: string) {
    const user: User | null = await this.dataSourse
      .getRepository(User)
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .where({ email })
      .getOne();

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
