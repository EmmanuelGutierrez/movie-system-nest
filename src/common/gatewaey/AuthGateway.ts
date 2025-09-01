import { UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/auth.service';
import { getCookie } from '../utils/getCookie';

export abstract class AuthGateway implements OnGatewayConnection {
  constructor(protected readonly authService: AuthService) {}
  handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const auth: string | undefined =
        client.handshake.headers.authorization ??
        client.handshake.headers.cookie;
      // console.log('client.handshake.headers', auth);
      if (!auth) {
        throw new UnauthorizedException('No auth');
      }
      // console.log(
      //   'CLIENT',
      //   getCookie('auth_token', client.handshake.headers.cookie),
      // );
      const token = client.handshake.headers.authorization
        ? auth.split(' ')[1]
        : client.handshake.headers.cookie
          ? getCookie('auth_token', client.handshake.headers.cookie)
          : '';
      console.log('TOKEN', token);
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
