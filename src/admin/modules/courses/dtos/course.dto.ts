import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { CourseExtraDescriptionType } from '../../../../orm/modules/courses/interfaces/course-extra-description-type.enum';
import { CourseType } from '../../../../orm/modules/courses/interfaces/course-type.enum';
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
import { apiSetLength } from '../../../../shared/helpers/api-set-length.helper';
import { booleanTransformer } from '../../../../shared/helpers/boolean-transformer.helper';
import { Lang } from '../../../../shared/interfaces/lang.enum';
import { PhotoDto } from '../../../../shared/modules/media/dtos/photo.dto';
import { ObjectLinkedDto } from '../../../shared/dtos/object-linked.dto';

class CourseBaseDto {
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

  @ApiProperty({ enum: CourseType })
  type!: CourseType;

  @ApiProperty({ type: [ObjectLinkedDto] })
  habits!: ObjectLinkedDto[];
}

export class CourseForListDto extends CourseBaseDto {
  @ApiProperty()
  name!: string;
}

export class CoursesForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [CourseForListDto] })
  courses!: CourseForListDto[];
}

export class CourseExtraDescriptionDto {
  @ApiProperty()
  title!: string;

  @ApiProperty({
    enum: CourseExtraDescriptionType,
  })
  type!: CourseExtraDescriptionType;

  @ApiProperty()
  description!: string[];
}

export class CourseI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  duration!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: [CourseExtraDescriptionDto] })
  extraDescription!: CourseExtraDescriptionDto[];
}

export class CourseDetailedDto extends CourseBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiPropertyOptional({ type: PhotoDto })
  photoInactive?: PhotoDto;

  @ApiProperty({ type: [CourseI18nDto] })
  translations!: CourseI18nDto[];
}

export class CoursesReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(booleanTransformer)
  disabled?: boolean;

  @ApiPropertyOptional({
    enum: CourseType,
  })
  @IsOptional()
  @IsEnum(CourseType)
  type?: CourseType;

  @ApiPropertyOptional({
    ...apiSetLength(3, 200),
  })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  name?: string;
}

export class CourseExtraDescriptionReqDto {
  @ApiProperty({
    ...apiSetLength(3, 200),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  title!: string;

  @ApiProperty({
    enum: CourseExtraDescriptionType,
  })
  @IsEnum(CourseExtraDescriptionType)
  @IsNotEmpty()
  type!: CourseExtraDescriptionType;

  @ApiProperty({
    type: [String],
    minItems: 1,
  })
  @IsNotEmpty()
  @Length(3, 2000, { each: true })
  @IsString({ each: true })
  @ArrayMinSize(1)
  description!: string[];
}

export class CourseI18nReqDto {
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
    ...apiSetLength(3, 200),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  duration!: string;

  @ApiProperty({
    ...apiSetLength(3, 2000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2000)
  description!: string;

  @ApiProperty({
    type: [CourseExtraDescriptionReqDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseExtraDescriptionReqDto)
  extraDescription!: CourseExtraDescriptionReqDto[];
}

export class CourseCreateReqDto {
  @ApiPropertyOptional({
    description: 'Индекс курса. По умолчанию 1000',
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

  @ApiProperty({
    type: [Number],
    description: 'ID привычек, от 0 до 3',
    minItems: 0,
    maxItems: 3,
  })
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(3)
  @Type(() => Number)
  @IsNumber({}, { each: true })
  habitsIds!: number[];

  @ApiProperty({
    enum: CourseType,
  })
  @IsEnum(CourseType)
  @IsNotEmpty()
  type!: CourseType;

  @ApiProperty({ description: 'ID фото для обложки курса' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  photoId!: number;

  @ApiPropertyOptional({
    description:
      'ID фото для неактивной обложки горы (type=mountain). Если не указан, то равен photoId',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  photoInactiveId?: number;

  @ApiProperty({
    type: [CourseI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseI18nReqDto)
  translations!: CourseI18nReqDto[];
}

export class CourseEditReqDto extends CourseCreateReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(booleanTransformer)
  disabled?: boolean;
}
