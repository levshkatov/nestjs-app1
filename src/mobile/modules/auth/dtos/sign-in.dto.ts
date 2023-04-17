import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, MaxLength } from '../../../../shared/class-validator';
import { IsPhoneNoPunctuation } from '../../../../shared/decorators/is-phone-no-punctuation.decorator';
import { apiSetLength } from '../../../../shared/helpers/api-set-length.helper';

export class SignInReqDto {
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
}
