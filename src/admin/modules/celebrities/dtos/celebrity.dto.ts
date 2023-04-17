import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
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
import { PhotoDto } from '../../../../shared/modules/media/dtos/photo.dto';
import { apiSetLength } from '../../../../shared/helpers/api-set-length.helper';
import { booleanTransformer } from '../../../../shared/helpers/boolean-transformer.helper';
import { Lang } from '../../../../shared/interfaces/lang.enum';
import { CELEBRITY_HABITS_LENGTH } from '../interfaces/celebrity.constants';
import { ObjectLinkedDto } from '../../../shared/dtos/object-linked.dto';

class CelebrityBaseDto {
  @ApiProperty()
  id!: number;

  @ApiPropertyOptional()
  index?: number;

  @ApiPropertyOptional()
  tag?: string;

  @ApiProperty()
  disabled!: boolean;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;

  @ApiProperty({ type: [ObjectLinkedDto] })
  habits!: ObjectLinkedDto[];
}

export class CelebrityForListDto extends CelebrityBaseDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;
}

export class CelebritiesForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [CelebrityForListDto] })
  celebrities!: CelebrityForListDto[];
}

export class CelebrityI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  caption!: string;
}

export class CelebrityDetailedDto extends CelebrityBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [CelebrityI18nDto] })
  translations!: CelebrityI18nDto[];
}

export class CelebritiesReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  id?: number;

  @ApiPropertyOptional({
    ...apiSetLength(3, 200),
  })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  name?: string;
}

export class CelebrityI18nReqDto {
  @ApiProperty({
    description: 'Локаль перевода',
    example: Lang.ru,
    enum: Lang,
  })
  @IsNotEmpty()
  @IsEnum(Lang)
  lang!: Lang;

  @ApiProperty({
    example: 'Крис Хемсворт',
    ...apiSetLength(3, 200),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  name!: string;

  @ApiProperty({
    example: 'Описание знаменитости',
    ...apiSetLength(3, 2000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2000)
  description!: string;

  @ApiProperty({
    example: 'Подпись знаменитости',
    ...apiSetLength(3, 200),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  caption!: string;
}

export class CelebrityCreateReqDto {
  @ApiPropertyOptional({
    description: 'Индекс знаменитости. По умолчанию 1000',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  index?: number;

  @ApiPropertyOptional({
    ...apiSetLength(3, 200, 'Уникальный тег'),
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  tag?: string;

  @ApiProperty({ description: 'ID фото для обложки знаменитости' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  photoId!: number;

  @ApiProperty({
    example: [1, 2, 3],
    type: [Number],
    description: 'Id привычек, ровно 3 элемента',
  })
  @IsArray()
  @ArrayMinSize(CELEBRITY_HABITS_LENGTH)
  @ArrayMaxSize(CELEBRITY_HABITS_LENGTH)
  @Type(() => Number)
  @IsNumber({}, { each: true })
  habitsIds!: number[];

  @ApiProperty({
    type: [CelebrityI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CelebrityI18nReqDto)
  translations!: CelebrityI18nReqDto[];
}

export class CelebrityEditReqDto extends CelebrityCreateReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(booleanTransformer)
  disabled?: boolean;
}
