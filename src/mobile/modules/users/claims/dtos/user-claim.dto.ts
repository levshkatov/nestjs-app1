import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from '../../../../../shared/class-validator';
import { apiSetLength } from '../../../../../shared/helpers/api-set-length.helper';

export class UserClaimReqDto {
  @ApiProperty({ example: 'Имя', ...apiSetLength(3, 200) })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  name!: string;

  @ApiProperty({ example: 'test@gmail.com', ...apiSetLength(null, 200) })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(200)
  email!: string;

  @ApiProperty({ example: 'Текст проблемы', ...apiSetLength(null, 5000) })
  @IsNotEmpty()
  @IsString()
  @MaxLength(5000)
  text!: string;
}
