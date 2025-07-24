import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { User } from 'src/modules/user/entities/user.entity';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  public handleRequest(err: unknown, user: User): any {
    return user;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('JWT');
    const isPublic: boolean = this.reflector.get(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) return true;

    await super.canActivate(context);

    const { user }: Request = context.switchToHttp().getRequest();
    console.log('user', user);
    if (!user) throw new UnauthorizedException('Unauthorized');

    return user ? true : false;
  }
}
