import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { config, configType } from 'src/common/config/config';

@Injectable()
export class PostgresqlConfigService implements TypeOrmOptionsFactory {
  @Inject(config.KEY)
  private readonly configService: configType;

  public createTypeOrmOptions():
    | Promise<TypeOrmModuleOptions>
    | TypeOrmModuleOptions {
    console.log(this.configService);
    return {
      type: 'postgres',
      host: this.configService.database.dbHost,
      port: parseInt(this.configService.database.dbPort as string),
      database: this.configService.database.dbName,
      username: this.configService.database.dbUser,
      password: this.configService.database.dbPass,
      entities: ['dist/modules/**/*.entity.{ts,js}'],
      synchronize: true,
      autoLoadEntities: true,
    };
  }
}
