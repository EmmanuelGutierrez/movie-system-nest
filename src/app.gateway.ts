import {
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from './modules/auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway(81, { transports: ['websocket'], namespace: 'app' })
export class AppGateway implements OnGatewayConnection {
  constructor(private readonly authService: AuthService) {}
  handleConnection(@ConnectedSocket() client: Socket) {
    const token: string | null = client.handshake.auth.token as string | null;
    try {
      if (!token) {
        throw new UnauthorizedException('No token');
      }
      const data = this.authService.validateToken(token);
      (client as any).user = data;
    } catch (error) {
      console.log('Token invalido', error);
      client.disconnect();
    }
  }
}
