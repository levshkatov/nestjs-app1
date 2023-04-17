import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from '../../orm/modules/users/interfaces/user-role.enum';
import { logClassName } from '../helpers/log-classname.helper';
import { IJWTUser } from '../modules/auth/interfaces/jwt-user.interface';

/**
 * Handler roles override class ones
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    logClassName(this.constructor.name, __filename);
  }

  canActivate(context: ExecutionContext): boolean {
    const rolesClass = this.reflector.get<UserRole[]>('roles', context.getClass()) || [];
    const rolesMethod = this.reflector.get<UserRole[]>('roles', context.getHandler()) || [];
    if (!rolesMethod.length && !rolesClass.length) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const user = <IJWTUser>request.user;
    if (!user) {
      throw new HttpException({}, 401);
    }

    const roles = rolesMethod.length ? rolesMethod : rolesClass;
    // maybe check in db for subscription status but now it's ok that user will remain subscribed after 15min (jwt lifetime) when subscription ended
    if (roles.includes(UserRole.mobileSubscribed)) {
      if (![UserRole.mobileSubscribed, UserRole.mobileAdmin].includes(user.role)) {
        throw new HttpException({}, 402);
      }
      return true;
    }

    return roles.includes(user.role);
  }
}
