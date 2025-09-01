import {
  ConnectedSocket,
  //   ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IoReserveSeat } from 'src/common/interface/ioReserveSeat.interface';
import { AuthGateway } from 'src/common/gatewaey/AuthGateway';
import { AuthService } from '../auth/auth.service';
import { SocketWithUser } from 'src/common/types/SocketWithUser.type';

@WebSocketGateway(81, { transports: ['websocket'], namespace: 'screening' })
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
export class ScreeningGetaway
  extends AuthGateway
  implements OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(protected readonly authService: AuthService) {
    super(authService);
  }
  handleDisconnect() {
    console.log('Disconnected');
  }
  afterInit() {
    console.log('AFTER INIT');
    // this.server.on('joinScreening', (screeningId: string, userId: string) => {
    //   console.log(`User ${userId} joined screening ${screeningId}`);
    //   this.server.socketsJoin(screeningId);
    // });
  }

  @SubscribeMessage('joinScreening')
  handleHello(
    @MessageBody()
    data: string[],
    @ConnectedSocket() socket: SocketWithUser,
  ) {
    console.log(
      `joinScreening - User ${socket.user.id} joined screening ${data[0]}`,
      data,
    );
    // this.server.to(data[0]).emit('joinScreening', socket.user.id.toString());
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
