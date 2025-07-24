import {
  //   ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IoReserveSeat } from 'src/common/constants/interface/ioReserveSeat.interface';

@WebSocketGateway(81, { transports: ['websocket'], namespace: 'screening' })
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
export class ScreeningGetaway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor() {}
  handleConnection() {
    console.log('Connected');
  }
  handleDisconnect() {
    console.log('Disconnected');
  }
  afterInit() {
    this.server.on('joinScreening', (screeningId: string, userId: string) => {
      console.log(`User ${userId} joined screening ${screeningId}`);
      this.server.socketsJoin(screeningId);
    });
  }

  @SubscribeMessage('joinScreening')
  handleHello(
    @MessageBody()
    data: string[],
    // @ConnectedSocket() socket: Socket,
  ) {
    console.log(`User ${data[0]} joined screening ${data[1]}|`, data);
    // this.server.to('1').emit('joinScreening', '3');
    this.server.socketsJoin(data[0]);

    // return data;
  }

  emitToScreening(
    screeningId: string,
    payload: IoReserveSeat | IoReserveSeat[],
  ) {
    console.log(screeningId, payload);
    this.server.to(screeningId).emit('joinScreening', payload);
  }
}
