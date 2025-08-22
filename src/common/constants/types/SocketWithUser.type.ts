import { Socket } from 'socket.io';
import { TokenDataI } from '../interface/token';

export type SocketWithUser = Socket & { user: TokenDataI };
