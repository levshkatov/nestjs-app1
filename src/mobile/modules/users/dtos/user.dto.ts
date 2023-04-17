import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  MaxDate,
  MaxLength,
} from '../../../../shared/class-validator';
import { IsPhoneNoPunctuation } from '../../../../shared/decorators/is-phone-no-punctuation.decorator';
import { apiSetLength } from '../../../../shared/helpers/api-set-length.helper';
import { booleanTransformer } from '../../../../shared/helpers/boolean-transformer.helper';

export class UserEditReqDto {
  @ApiPropertyOptional({
    example: 'Константин',
    ...apiSetLength(3, 200, 'Допустимы пробелы'),
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  name?: string;

  @ApiPropertyOptional({ example: '2000-01-10', format: 'date' })
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(`${value.split('T')[0]}T00:00:00.000Z`))
  @IsDate()
  @MaxDate(new Date())
  birthdate?: Date;

  // @ApiPropertyOptional({
  //   example: '+79999999999',
  //   ...apiSetLength(null, 16, 'Обязательно наличие кода страны со знаком +, без дефисов, пробелов и т.д')
  // })
  // @IsOptional()
  // @IsNotEmpty()
  // @IsPhoneNoPunctuation()
  // @IsPhoneNumber()
  // @MaxLength(16)
  // phone?: string;

  @ApiPropertyOptional({ example: 'test@gmail.com', ...apiSetLength(null, 200) })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(200)
  email?: string;
}

export class UserDeleteDto {
  @ApiPropertyOptional({
    description: 'Для принудительного удаления профиля',
  })
  @IsOptional()
  @Transform(booleanTransformer)
  force?: boolean;
}
