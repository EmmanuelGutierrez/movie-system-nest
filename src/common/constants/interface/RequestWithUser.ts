import { Request } from 'express';
import { TokenDataI } from './token';

export interface RequestWithUserI extends Request {
  user: TokenDataI;
}
