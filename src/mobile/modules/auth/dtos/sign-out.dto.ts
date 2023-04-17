import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, MaxLength } from '../../../../shared/class-validator';
import { apiSetLength } from '../../../../shared/helpers/api-set-length.helper';
import { SignOutReqBaseDto } from '../../../../shared/modules/auth/dtos/sign-out.dto';

export class SignOutReqDto extends SignOutReqBaseDto {
  @ApiProperty({ example: '6bae1d4d-f73e-4722-8d32-05329f168325', ...apiSetLength(null, 40) })
  @IsNotEmpty()
  @IsUUID(4)
  @MaxLength(40)
  refreshToken!: string;
}
