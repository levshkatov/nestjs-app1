import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LetterTrigger } from '../../../../orm/modules/letters/interfaces/letter-trigger.enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from '../../../../shared/class-validator';
import { PagesDto } from '../../../../shared/dtos/page.dto';
import { apiSetLength } from '../../../../shared/helpers/api-set-length.helper';
import { Lang } from '../../../../shared/interfaces/lang.enum';
import { ObjectLinkedDto } from '../../../shared/dtos/object-linked.dto';

class LetterBaseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ enum: LetterTrigger })
  trigger!: LetterTrigger;

  @ApiProperty({
    description: 'Объекты связанные с письмом',
    type: [ObjectLinkedDto],
  })
  linked!: ObjectLinkedDto[];
}

export class LetterForListDto extends LetterBaseDto {
  @ApiProperty()
  name!: string;
}

export class LettersForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [LetterForListDto] })
  letters!: LetterForListDto[];
}

export class LetterI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;
}

export class LetterDetailedDto extends LetterBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [LetterI18nDto] })
  translations!: LetterI18nDto[];
}

export class LettersReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  id?: number;

  @ApiPropertyOptional({ enum: LetterTrigger })
  @IsOptional()
  @IsEnum(LetterTrigger)
  trigger?: LetterTrigger;

  @ApiPropertyOptional({
    ...apiSetLength(3, 200),
  })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  name?: string;
}

export class LetterI18nReqDto {
  @ApiProperty({
    description: 'Локаль перевода',
    example: Lang.ru,
    enum: Lang,
  })
  @IsNotEmpty()
  @IsEnum(Lang)
  lang!: Lang;

  @ApiProperty({
    ...apiSetLength(3, 200),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  name!: string;

  @ApiProperty({
    ...apiSetLength(3, 5000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 5000)
  description!: string;
}

export class LetterCreateReqDto {
  @ApiProperty({ enum: LetterTrigger })
  @IsEnum(LetterTrigger)
  @IsNotEmpty()
  trigger!: LetterTrigger;

  @ApiProperty({
    type: [LetterI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LetterI18nReqDto)
  translations!: LetterI18nReqDto[];
}

export class LetterEditReqDto extends LetterCreateReqDto {}
