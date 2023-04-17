import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../orm/modules/users/interfaces/user-role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
