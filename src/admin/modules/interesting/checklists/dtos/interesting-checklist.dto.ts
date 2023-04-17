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
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';
import { ObjectLinkedDto } from '../../../../shared/dtos/object-linked.dto';

class InterestingChecklistBaseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  disabled!: boolean;

  @ApiProperty({ type: ObjectLinkedDto })
  category!: ObjectLinkedDto;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;

  @ApiProperty({ type: ObjectLinkedDto })
  task!: ObjectLinkedDto;
}

export class InterestingChecklistForListDto extends InterestingChecklistBaseDto {
  @ApiProperty()
  title!: string;
}

export class InterestingChecklistsForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [InterestingChecklistForListDto] })
  interestingChecklists!: InterestingChecklistForListDto[];
}

export class InterestingChecklistI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  title!: string;
}

export class InterestingChecklistDetailedDto extends InterestingChecklistBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [InterestingChecklistI18nDto] })
  translations!: InterestingChecklistI18nDto[];
}

export class InterestingChecklistsReqDto {}

export class InterestingChecklistI18nReqDto {
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
}

export class InterestingChecklistCreateReqDto {
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

  @ApiProperty({ description: 'ID задания' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  taskId!: number;

  @ApiProperty({
    type: [InterestingChecklistI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterestingChecklistI18nReqDto)
  translations!: InterestingChecklistI18nReqDto[];
}

export class InterestingChecklistEditReqDto extends InterestingChecklistCreateReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(booleanTransformer)
  disabled?: boolean;
}
