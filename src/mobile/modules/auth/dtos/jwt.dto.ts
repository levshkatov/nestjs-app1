import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, MaxLength } from '../../../../shared/class-validator';
import { apiSetLength } from '../../../../shared/helpers/api-set-length.helper';
import { RefreshTokenReqBaseDto, TokenBaseDto } from '../../../../shared/modules/auth/dtos/jwt.dto';
import { UserDto } from '../../../shared/dtos/user.dto';

export class UserWithTokensDto extends TokenBaseDto {
  @ApiProperty()
  refreshToken!: string;

  @ApiProperty({ type: UserDto })
  user!: UserDto;

  @ApiPropertyOptional()
  firstAuth?: boolean;
}

export class RefreshTokenReqDto extends RefreshTokenReqBaseDto {
  @ApiProperty({ example: '6bae1d4d-f73e-4722-8d32-05329f168325', ...apiSetLength(null, 40) })
  @IsNotEmpty()
  @IsUUID(4)
  @MaxLength(40)
  refreshToken!: string;
}
