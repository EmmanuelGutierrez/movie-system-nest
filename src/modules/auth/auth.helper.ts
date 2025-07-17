import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { jwtPayloadI } from '../../common/constants/interface/token';
import { User } from '../user/entities/user.entity';
@Injectable()
export class AuthHelper {
  constructor(private readonly jwt: JwtService) {}

  public generateTokenPassword(): string {
    const jwtPayload = {
      audience: 'changePassword',
    };
    return this.jwt.sign(jwtPayload, { expiresIn: '60m' });
  }

  public generateTokenForUser(user: User): string {
    const jwtPayload: jwtPayloadI = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwt.sign(jwtPayload);
  }

  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}
