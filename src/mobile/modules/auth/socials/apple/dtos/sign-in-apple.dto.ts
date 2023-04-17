import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Length } from '../../../../../../shared/class-validator';
import { apiSetLength } from '../../../../../../shared/helpers/api-set-length.helper';
import { OffsetUTC } from '../../../../../../shared/interfaces/offset-utc.enum';

export class SignInAppleReqDto {
  @ApiProperty({ ...apiSetLength(3, 200, 'Authorization code от Apple') })
  @IsNotEmpty()
  @IsString()
  @Length(40, 90)
  authCode!: string;

  @ApiProperty({
    description: 'Сдвиг по времени, относительно UTC',
    enum: OffsetUTC,
    example: OffsetUTC['+00:00'],
  })
  @IsEnum(OffsetUTC)
  @IsNotEmpty()
  offsetUTC!: OffsetUTC;
}
