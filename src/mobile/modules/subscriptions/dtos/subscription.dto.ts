import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsBase64,
  IsString,
  Length,
  IsOptional,
  IsEnum,
} from '../../../../shared/class-validator';
import { SubscriptionType } from '../interfaces/subscription-type.enum';

export class VerifyReceiptDto {
  @ApiProperty({ description: 'Если true, необходимо добавить текстовый блок про триал' })
  trial!: boolean;

  @ApiProperty({ description: 'Если true, необходимо добавить кнопку Возобновить подписку' })
  restore!: boolean;

  constructor({ trial, restore }: VerifyReceiptDto) {
    this.trial = trial;
    this.restore = restore;
  }
}

export class VerifyReceiptReqDto {
  @ApiPropertyOptional({ enum: SubscriptionType })
  @IsOptional()
  @IsEnum(SubscriptionType)
  type?: SubscriptionType;

  @ApiProperty({
    description:
      'Строка в кодировке base64, <a href="https://developer.apple.com/documentation/storekit/original_api_for_in-app_purchase/validating_receipts_with_the_app_store">подробнее</a>',
  })
  @IsNotEmpty()
  @IsBase64()
  data!: string;

  @ApiProperty({
    description:
      'Строка 32 символа, <a href="https://help.apple.com/app-store-connect/#/devf341c0f01">подробнее</a>',
  })
  @IsNotEmpty()
  @IsString()
  @Length(32, 32)
  password!: string;
}
