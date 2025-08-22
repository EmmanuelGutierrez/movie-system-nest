import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { config, configType } from './common/config/config';
import { getEnvPath } from './common/utils/env.helper';
import { UserModule } from './modules/user/user.module';
import { CinemaModule } from './modules/cinema/cinema.module';
import { FileModule } from './modules/file/file.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { MovieModule } from './modules/movie/movie.module';
import { ScreeningModule } from './modules/screening/screening.module';
import { TheaterModule } from './modules/theater/theater.module';
import { AuthModule } from './modules/auth/auth.module';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresqlConfigService } from './database/ormconfig';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { RedisModule } from './modules/redis/redis.module';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: PostgresqlConfigService }),
    ConfigModule.forRoot({
      envFilePath: getEnvPath(`${__dirname}/common/envs`),
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object().keys({
        // API_ENV: Joi.string().default('dev'),
        PORT: Joi.number().default(3000),
        API_KEY: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASS: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_DB: Joi.number().required(),
        REDIS_PASSWORD: Joi.string(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [config.KEY],
      useFactory: (configService: configType) => {
        return {
          // ttl: 30 * 60000,
          ttl: 60 * 5 * 1000,
          stores: [
            new KeyvRedis({
              url: `redis://:${configService.redis.password}@${configService.redis.host}:${configService.redis.port}/${configService.redis.db}`,
            }),
          ],
        };
      },
    }),
    UserModule,
    CinemaModule,
    FileModule,
    InvoiceModule,
    MovieModule,
    ScreeningModule,
    TheaterModule,
    AuthModule,
    CloudinaryModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
