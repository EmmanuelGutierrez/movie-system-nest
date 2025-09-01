import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthHelper } from './auth.helper';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { config, configType } from 'src/common/config/config';
import { JwtStrategy } from './strategies/JwtStrategy';
import { LocalStrategy } from './strategies/LocalStrategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: configType) => {
        return {
          secret: configService.api.jwtSecret,
          signOptions: {
            expiresIn: '120m',
          },
        };
      },
    }),
  ],
})
export class AuthModule {}
