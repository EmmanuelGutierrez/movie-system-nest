import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { TokenDataI } from 'src/common/constants/interface/token';
import { Request } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  login(@Req() req: Request) {
    return req.user as TokenDataI;
  }

  @Post('/register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }
}
