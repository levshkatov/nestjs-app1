import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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

class ExerciseBaseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ type: [ObjectLinkedDto] })
  tasks!: ObjectLinkedDto[];

  @ApiProperty({
    type: [ObjectLinkedDto],
    description: 'Объекты связанные с упражнением',
  })
  linked!: ObjectLinkedDto[];
}

export class ExerciseForListDto extends ExerciseBaseDto {
  @ApiProperty()
  name!: string;
}

export class ExercisesForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [ExerciseForListDto] })
  exercises!: ExerciseForListDto[];
}

export class ExerciseI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  goal!: string;

  @ApiProperty()
  author!: string;

  @ApiProperty()
  source!: string;
}

export class ExerciseDetailedDto extends ExerciseBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [ExerciseI18nDto] })
  translations!: ExerciseI18nDto[];
}

export class ExercisesReqDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taskId?: number;
}

export class ExerciseI18nReqDto {
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

  @ApiProperty({
    ...apiSetLength(3, 2000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2000)
  goal!: string;

  @ApiProperty({
    ...apiSetLength(3, 2000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2000)
  author!: string;

  @ApiProperty({
    ...apiSetLength(3, 2000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2000)
  source!: string;
}

export class ExerciseCreateReqDto {
  @ApiProperty({
    type: [ExerciseI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseI18nReqDto)
  translations!: ExerciseI18nReqDto[];
}

export class ExerciseEditReqDto extends ExerciseCreateReqDto {}
