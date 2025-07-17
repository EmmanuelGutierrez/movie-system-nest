import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config, configType } from 'src/common/config/config';
import { TokenDataI } from 'src/common/constants/interface/token';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(config.KEY) private readonly configService: configType) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.api.jwtSecret || 'dev',
    });
  }

  validate(payload: TokenDataI): TokenDataI {
    return payload;
  }
}
