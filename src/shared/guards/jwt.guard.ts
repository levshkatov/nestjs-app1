import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { logClassName } from '../helpers/log-classname.helper';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
    logClassName(this.constructor.name, __filename);
  }

  handleRequest<IJWTUser>(
    err: any,
    user: IJWTUser,
    info: any,
    context: ExecutionContext,
  ): IJWTUser | null {
    const skipAuth: boolean | undefined = this.reflector.getAllAndOverride('skip_auth', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) {
      return user || null;
    }

    if (err || !user) {
      throw new HttpException({}, 401);
    }
    return user;
  }
}
