import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';
import { ScreeningService } from './screening.service';

@Injectable()
export class ScreeningListenerService implements OnModuleDestroy, OnModuleInit {
  constructor(
    @Inject('REDIS')
    private readonly redisProvider: Redis,
    private readonly screeningService: ScreeningService,
  ) {}
  // private client: Redis;
  private suscriber: Redis;
  async onModuleInit() {
    // this.redisProvider = new Redis({
    //   host: this.configService.redis.host,
    //   port: this.configService.redis.port,
    //   db: this.configService.redis.db,
    //   password: this.configService.redis.password,
    // });
    this.suscriber = this.redisProvider.duplicate();

    await this.suscriber.psubscribe('__keyevent@1__:expired', (err, count) =>
      console.log('key expired', err, count),
    ); // const suscriber = this.redisProvider.duplicate();
    // const suscriber = this.redisService.getSuscriber();
    // suscriber
    //   .psubscribe('__keyevent@1__:expired', (err, count) =>
    //     console.log('key expired', err, count),
    //   )
    //   .then(() => {
    //     console.log('suscriber ready');
    //   });
    // console.log('suscriber', suscriber);
    this.suscriber.on('pmessage', (pattern, channel, message) => {
      console.log('pmessage', pattern, channel, message);
      const data = message.split(':');
      if (data[0] && data[0] === 'screening' && data[1] && data[3]) {
        this.screeningService.notifySeatReservationExpired(
          parseInt(data[3]),
          parseInt(data[1]),
        );
      }
    });

    this.redisProvider.on('connect', () => console.log('Redis connect'));
    this.redisProvider.on('error', () => console.log('Redis error'));
  }

  async onModuleDestroy() {
    await this.redisProvider?.quit();
  }
}
