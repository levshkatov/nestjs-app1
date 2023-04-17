import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  Max,
  MaxLength,
  Min,
} from '../../../../shared/class-validator';
import { IsPhoneNoPunctuation } from '../../../../shared/decorators/is-phone-no-punctuation.decorator';
import { apiSetLength } from '../../../../shared/helpers/api-set-length.helper';
import { OffsetUTC } from '../../../../shared/interfaces/offset-utc.enum';

export class VerifyCodeReqDto {
  @ApiProperty({ example: '+79999999999', ...apiSetLength(null, 16) })
  @IsNotEmpty()
  @IsPhoneNoPunctuation()
  @IsPhoneNumber()
  @MaxLength(16)
  phone!: string;

  @ApiProperty({ example: 1234 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1000)
  @Max(9999)
  code!: number;

  @ApiProperty({
    description: 'Сдвиг по времени, относительно UTC',
    enum: OffsetUTC,
    example: OffsetUTC['+00:00'],
  })
  @IsEnum(OffsetUTC)
  @IsNotEmpty()
  offsetUTC!: OffsetUTC;
}

export class VerifyCodeNewPhoneReqDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  userId!: number;

  @ApiProperty({ example: '+79999999999', ...apiSetLength(null, 16) })
  @IsNotEmpty()
  @IsPhoneNoPunctuation()
  @IsPhoneNumber()
  @MaxLength(16)
  phone!: string;

  @ApiProperty({ example: 1234 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1000)
  @Max(9999)
  code!: number;
}
