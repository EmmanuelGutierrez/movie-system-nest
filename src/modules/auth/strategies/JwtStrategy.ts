import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config, configType } from 'src/common/config/config';
import { TokenDataI } from 'src/common/constants/interface/token';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(config.KEY) private readonly configService: configType) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          console.log('COOKIS', req.cookies, req.signedCookies);
          if (req.cookies && req.cookies['auth_token']) {
            return req.cookies['auth_token'] as string;
          }
          return null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: true,
      secretOrKey: configService.api.jwtSecret || 'dev',
    });
  }

  validate(payload: TokenDataI): TokenDataI {
    return payload;
  }
}
