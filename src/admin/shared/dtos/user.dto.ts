import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';

export class UserDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;
}
