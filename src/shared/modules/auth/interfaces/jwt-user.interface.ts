import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import { Lang } from '../../../interfaces/lang.enum';
import { OffsetUTC } from '../../../interfaces/offset-utc.enum';

export interface IJWTUser {
  userId: number;
  role: UserRole;
  name: string;
  offsetUTC: OffsetUTC;
  lang: Lang;
}
