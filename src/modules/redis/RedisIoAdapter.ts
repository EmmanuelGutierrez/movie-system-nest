/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Server } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private adapterContructor: ReturnType<typeof createAdapter>;
  async connectToRedis(): Promise<void> {
    // console.log(process.env);
    // url: 'redis://localhost:6379',
    const pubClient = createClient({
      database: parseInt(process.env.REDIS_DB as string),
      password: process.env.REDIS_PASSWORD as string,
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterContructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, options);
    server.adapter(this.adapterContructor);
    return server;
  }
}
