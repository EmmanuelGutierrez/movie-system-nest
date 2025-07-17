import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string): Promise<{ token: string }> {
    // const user = await this.authService.validateUser(email, password);
    // console.log(user);
    const payload = await this.authService.Login(email, password);
    return payload;
  }
}
