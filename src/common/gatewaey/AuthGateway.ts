import { UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/auth.service';

export abstract class AuthGateway implements OnGatewayConnection {
  constructor(protected readonly authService: AuthService) {}
  handleConnection(@ConnectedSocket() client: Socket) {
    const auth: string | null = client.handshake.headers.authorization as
      | string
      | null;
    console.log('CLIENT', client);
    try {
      if (!auth) {
        throw new UnauthorizedException('No token');
      }
      const token = auth.split(' ')[1];
      const data = this.authService.validateToken(token);
      (client as any).user = data;
    } catch (error) {
      console.log('Token invalido', error);
      client.disconnect();
    }
  }
}
