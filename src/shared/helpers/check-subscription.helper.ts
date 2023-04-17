import { HttpException } from '@nestjs/common';
import { UserRole } from '../../orm/modules/users/interfaces/user-role.enum';
import { IJWTUser } from '../modules/auth/interfaces/jwt-user.interface';

export const checkSubscription = (user?: IJWTUser) => {
  if (!user || !user.role) {
    throw new HttpException({}, 401);
  }
  if (![UserRole.mobileSubscribed, UserRole.mobileAdmin].includes(user.role)) {
    throw new HttpException({}, 402);
  }
};
