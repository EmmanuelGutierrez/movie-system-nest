import { roles } from '../enum/roles.enum';

export interface jwtPayloadI {
  id: number;
  email: string;
  role: roles;
}

export interface TokenDataI extends jwtPayloadI {
  iat: number;
  exp: number;
}
