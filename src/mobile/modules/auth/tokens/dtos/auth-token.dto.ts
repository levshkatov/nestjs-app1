import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from '../../../../../shared/class-validator';
import { apiSetLength } from '../../../../../shared/helpers/api-set-length.helper';

class FcmBaseReqDto {
  @ApiProperty({ example: '6bae1d4d-f73e-4722-8d32-05329f168325', ...apiSetLength(null, 40) })
  @IsNotEmpty()
  @IsUUID(4)
  @MaxLength(40)
  refreshToken!: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  sessionId!: number;
}

export class FcmCreateReqDto extends FcmBaseReqDto {
  @ApiProperty({ description: 'FCM токен' })
  @IsString()
  @IsNotEmpty()
  fcmToken!: string;
}

export class FcmDeleteReqDto extends FcmBaseReqDto {}
