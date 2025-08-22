import { Controller, Post, UseGuards, Req, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: `Login response`,
    type: LoginResponseDto,
  })
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  login(
    @Req() req: Request,

    @Body() _body: LoginDto,
    @Res() res: Response,
  ) {
    // const data = await this.authService.Login(_body.email, _body.password);
    // // res.cookie('jwt', data.token, { httpOnly: true });
    // console.log('AUTH');
    // res.cookie('auth_token', data.token, {
    //   httpOnly: true,
    //   sameSite: 'lax',
    //   secure: false,
    //   maxAge: 30,
    // });
    // console.log('AUTH', req);
    // res.cookie('auth_token', req.user, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   maxAge: 30, // 1 semana
    //   path: '/',
    // });
    res.send(req.user);
    // return req.user as { token: string };
  }

  @Post('/register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }
}
