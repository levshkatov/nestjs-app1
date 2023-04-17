import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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
} from '../../../../../shared/class-validator';
import { PagesDto } from '../../../../../shared/dtos/page.dto';
import { apiSetLength } from '../../../../../shared/helpers/api-set-length.helper';
import { booleanTransformer } from '../../../../../shared/helpers/boolean-transformer.helper';
import { Lang } from '../../../../../shared/interfaces/lang.enum';
import { AudioDto } from '../../../../../shared/modules/media/dtos/audio.dto';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';
import { ObjectLinkedDto } from '../../../../shared/dtos/object-linked.dto';

class InterestingMeditationBaseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  disabled!: boolean;

  @ApiProperty({ type: ObjectLinkedDto })
  category!: ObjectLinkedDto;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;

  @ApiProperty({ type: AudioDto })
  audioFemale!: AudioDto;

  @ApiProperty({ type: AudioDto })
  audioMale!: AudioDto;
}

export class InterestingMeditationForListDto extends InterestingMeditationBaseDto {
  @ApiProperty()
  title!: string;
}

export class InterestingMeditationsForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [InterestingMeditationForListDto] })
  interestingMeditations!: InterestingMeditationForListDto[];
}

export class InterestingMeditationI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;
}

export class InterestingMeditationDetailedDto extends InterestingMeditationBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [InterestingMeditationI18nDto] })
  translations!: InterestingMeditationI18nDto[];
}

export class InterestingMeditationsReqDto {}

export class InterestingMeditationI18nReqDto {
  @ApiProperty({
    description: 'Локаль перевода',
    example: Lang.ru,
    enum: Lang,
  })
  @IsNotEmpty()
  @IsEnum(Lang)
  lang!: Lang;

  @ApiProperty({
    example: 'Заголовок',
    ...apiSetLength(3, 200),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  title!: string;

  @ApiProperty({
    example: 'Описание',
    ...apiSetLength(3, 2000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2000)
  description!: string;
}

export class InterestingMeditationCreateReqDto {
  @ApiProperty({ description: 'ID категории' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  categoryId!: number;

  @ApiProperty({ description: 'ID фото' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  photoId!: number;

  @ApiProperty({ description: 'ID аудио' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  audioFemaleId!: number;

  @ApiPropertyOptional({ description: 'ID аудио. Если не указан, то равен audioFemaleId' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  audioMaleId?: number;

  @ApiProperty({
    type: [InterestingMeditationI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterestingMeditationI18nReqDto)
  translations!: InterestingMeditationI18nReqDto[];
}

export class InterestingMeditationEditReqDto extends InterestingMeditationCreateReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(booleanTransformer)
  disabled?: boolean;
}
