import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  MaxDate,
  MaxLength,
} from '../../../../shared/class-validator';
import { IsPhoneNoPunctuation } from '../../../../shared/decorators/is-phone-no-punctuation.decorator';
import { apiSetLength } from '../../../../shared/helpers/api-set-length.helper';

export class SignUpReqDto {
  @ApiProperty({
    example: 'Константин',
    ...apiSetLength(3, 200, 'Допустимы пробелы'),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  name!: string;

  @ApiProperty({ example: '2000-01-10', format: 'date' })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(`${value.split('T')[0]}T00:00:00.000Z`))
  @IsDate()
  @MaxDate(new Date())
  birthdate!: Date;

  @ApiProperty({
    example: '+79999999999',
    ...apiSetLength(
      null,
      16,
      'Обязательно наличие кода страны со знаком +, без дефисов, пробелов и т.д',
    ),
  })
  @IsNotEmpty()
  @IsPhoneNoPunctuation()
  @IsPhoneNumber()
  @MaxLength(16)
  phone!: string;

  @ApiProperty({ example: 'test@gmail.com', ...apiSetLength(null, 200) })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(200)
  email!: string;
}
