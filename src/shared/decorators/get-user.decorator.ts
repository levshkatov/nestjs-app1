import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJWTUser } from '../modules/auth/interfaces/jwt-user.interface';

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext): IJWTUser => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
