import { ApiProperty } from '@nestjs/swagger';
import { RefreshTokenReqBaseDto, TokenBaseDto } from '../../../../shared/modules/auth/dtos/jwt.dto';
import { UserDto } from '../../../shared/dtos/user.dto';

export class UserWithSessionIdDto {
  @ApiProperty()
  sessionId!: number;

  @ApiProperty({ type: UserDto })
  user!: UserDto;
}

export class UserWithTokensDto extends TokenBaseDto {
  @ApiProperty()
  refreshToken!: string;

  @ApiProperty({ type: UserDto })
  user!: UserDto;
}

export class RefreshTokenReqDto extends RefreshTokenReqBaseDto {}
