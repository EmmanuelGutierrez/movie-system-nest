import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/exception/http-exception-filter';
import { RedisIoAdapter } from './modules/redis/RedisIoAdapter';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as morgan from 'morgan';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // console.log('APP', app);
  app.use(cookieParser());
  app.use(helmet());
  app.use(morgan('dev'));
  app.enableCors({
    origin: [
      // ? Development environment
      'http://localhost:3001',
      // * Add Production and Staging URLs here
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'Acept'],
    credentials: true,
    // allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  // app.enableCors({
  //   origin: '*',
  // });
  // app.use(
  //   cors({
  //     origin: 'http://localhost:3004',
  //     credentials: true,
  //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //     allowedHeaders: 'Content-Type, Accept, Authorization',
  //   }),
  // );
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT') as number;
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const configSwagger = new DocumentBuilder()
    .setTitle('Monotributo Recurrente')
    .setDescription('Monotributo API description')
    .setVersion('1.0')
    .setOpenAPIVersion('3.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api-doc', app, document);
  await app.listen(port);
}
void bootstrap();
