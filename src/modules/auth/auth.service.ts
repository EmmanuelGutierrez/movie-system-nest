import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthHelper } from './auth.helper';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authHelper: AuthHelper,
  ) {}
  async Login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);
    const token = this.authHelper.generateTokenForUser(user);
    const payload = { token };
    return payload;
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userService.getOneByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('No auth');
    }
    console.log('user pass', user.password, pass);
    const isValidPass = this.authHelper.isPasswordValid(pass, user.password);
    console.log('validate', isValidPass);
    if (!isValidPass) {
      throw new UnauthorizedException('No auth');
    }
    return user;
  }

  async register({ password, ...data }: CreateUserDto) {
    const existUser = await this.userService.getOneByEmail(data.email);
    if (existUser) {
      throw new ConflictException('User exist');
    }
    const hashedPassword = this.authHelper.encodePassword(password);
    const newUser = await this.userService.creatUser({
      password: hashedPassword,
      ...data,
    });
    const token = this.authHelper.generateTokenForUser(newUser);
    return { token };
  }
}
