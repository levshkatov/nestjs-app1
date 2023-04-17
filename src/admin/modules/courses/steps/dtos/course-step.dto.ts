import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
} from '../../../../../shared/class-validator';
import { apiSetLength } from '../../../../../shared/helpers/api-set-length.helper';
import { Lang } from '../../../../../shared/interfaces/lang.enum';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';
import { ObjectLinkedDto } from '../../../../shared/dtos/object-linked.dto';

class CourseStepBaseDto {
  @ApiProperty()
  index!: number;

  @ApiPropertyOptional({ type: PhotoDto })
  photo?: PhotoDto;

  @ApiProperty({ type: [ObjectLinkedDto] })
  letters!: ObjectLinkedDto[];

  @ApiProperty({ type: [ObjectLinkedDto] })
  exercises!: ObjectLinkedDto[];
}

export class CourseStepForListDto extends CourseStepBaseDto {
  @ApiProperty()
  name!: string;
}

export class CourseStepsForListDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [CourseStepForListDto] })
  courseSteps!: CourseStepForListDto[];
}

export class CourseStepI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;
}

export class CourseStepDetailedDto extends CourseStepBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [CourseStepI18nDto] })
  translations!: CourseStepI18nDto[];
}

export class CourseStepI18nReqDto {
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
    ...apiSetLength(3, 2000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2000)
  description!: string;
}

export class CourseStepCreateReqDto {
  @ApiProperty({
    description: 'Индекс задания. Если 0 то добавится в конец',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  index!: number;

  @ApiPropertyOptional({
    description: 'ID фото для обложки шага курса. Только для courseType=category',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  photoId?: number;

  @ApiProperty({
    type: [Number],
    description: 'ID писем, от 0 до 5',
    minItems: 0,
    maxItems: 5,
  })
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(5)
  @Type(() => Number)
  @IsNumber({}, { each: true })
  lettersIds!: number[];

  @ApiProperty({
    type: [CourseStepI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseStepI18nReqDto)
  translations!: CourseStepI18nReqDto[];
}

export class CourseStepEditReqDto extends CourseStepCreateReqDto {}

export class ParamCourseIdReqDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  courseId!: number;
}
