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

class InterestingHelpBaseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  disabled!: boolean;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;

  @ApiProperty({ type: AudioDto })
  audio!: AudioDto;
}

export class InterestingHelpForListDto extends InterestingHelpBaseDto {
  @ApiProperty()
  title!: string;
}

export class InterestingHelpsForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [InterestingHelpForListDto] })
  interestingHelps!: InterestingHelpForListDto[];
}

export class InterestingHelpI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;
}

export class InterestingHelpDetailedDto extends InterestingHelpBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [InterestingHelpI18nDto] })
  translations!: InterestingHelpI18nDto[];
}

export class InterestingHelpsReqDto {}

export class InterestingHelpI18nReqDto {
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

export class InterestingHelpCreateReqDto {
  @ApiProperty({ description: 'ID фото' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  photoId!: number;

  @ApiProperty({ description: 'ID аудио' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  audioId!: number;

  @ApiProperty({
    type: [InterestingHelpI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterestingHelpI18nReqDto)
  translations!: InterestingHelpI18nReqDto[];
}

export class InterestingHelpEditReqDto extends InterestingHelpCreateReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(booleanTransformer)
  disabled?: boolean;
}
