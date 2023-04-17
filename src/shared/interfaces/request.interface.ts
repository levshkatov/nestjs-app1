import { Request } from 'express';
import { IJWTUser } from '../modules/auth/interfaces/jwt-user.interface';

export interface RequestExt extends Request {
  serverError?: string;
  errors?: string[];
  user?: IJWTUser;
}
