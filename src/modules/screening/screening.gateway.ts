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
import { IoReserveSeat } from 'src/common/constants/interface/ioReserveSeat.interface';
import { AuthGateway } from 'src/common/gatewaey/AuthGateway';
import { AuthService } from '../auth/auth.service';
import { SocketWithUser } from 'src/common/constants/types/SocketWithUser.type';

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
    this.server.on('joinScreening', (screeningId: string, userId: string) => {
      console.log(`User ${userId} joined screening ${screeningId}`);
      this.server.socketsJoin(screeningId);
    });
  }

  @SubscribeMessage('joinScreening')
  handleHello(
    @MessageBody()
    data: string[],
    @ConnectedSocket() socket: SocketWithUser,
  ) {
    console.log(`User ${socket.user.id} joined screening ${data[1]}|`, data);
    // this.server.to('1').emit('joinScreening', '3');
    this.server.socketsJoin(socket.user.id.toString());

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
