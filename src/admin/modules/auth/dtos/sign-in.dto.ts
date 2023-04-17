import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from '../../../../shared/class-validator';
import { IsPassword } from '../../../../shared/decorators/is-password.decorator';
import { IsUsername } from '../../../../shared/decorators/is-username.decorator';
import { apiSetLength } from '../../../../shared/helpers/api-set-length.helper';
import { OffsetUTC } from '../../../../shared/interfaces/offset-utc.enum';

export class SignInReqDto {
  @ApiProperty({
    example: 'admin',
    ...apiSetLength(3, 20, 'Может содержать англ. буквы, цифры, дефисы и подчёркивания'),
  })
  @IsNotEmpty()
  @IsUsername({ min: 3, max: 20 })
  @Transform(({ value }) => value.toLowerCase())
  username!: string;

  @ApiProperty({
    example: '12345',
    ...apiSetLength(5, 30, 'Может содержать англ. буквы, цифры, спец символы (без пробелов)'),
  })
  @IsNotEmpty()
  @IsPassword({ min: 5, max: 30 })
  password!: string;

  @ApiProperty({
    description: 'Сдвиг по времени, относительно UTC',
    enum: OffsetUTC,
    example: OffsetUTC['+00:00'],
  })
  @IsEnum(OffsetUTC)
  @IsNotEmpty()
  offsetUTC!: OffsetUTC;
}
