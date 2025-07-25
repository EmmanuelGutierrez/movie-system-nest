import { Request } from 'express';
import { User } from 'src/modules/user/entities/user.entity';

export interface RequestWithUserI extends Request {
  user: User;
}
