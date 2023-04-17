import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
  ValidateNested,
} from '../../../../../shared/class-validator';
import { apiSetLength } from '../../../../../shared/helpers/api-set-length.helper';
import { Lang } from '../../../../../shared/interfaces/lang.enum';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';

export class HabitCategoryBalanceForListDto {
  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;

  @ApiProperty()
  iconName!: string;
}

export class HabitCategoryBalanceI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  iconName!: string;

  @ApiProperty()
  iconCaption!: string;

  @ApiProperty()
  iconClosedCaption!: string;

  @ApiProperty()
  iconNewCaption!: string;

  @ApiProperty({
    type: [String],
    ...apiSetLength(11, 11, 'Упорядоченный список строк для подписей к балансу'),
  })
  balanceCaptions!: string[];
}

export class HabitCategoryBalanceDetailedDto {
  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;

  @ApiProperty({ type: [HabitCategoryBalanceI18nDto] })
  translations!: HabitCategoryBalanceI18nDto[];
}

export class HabitCategoryBalanceI18nReqDto {
  @ApiProperty({
    description: 'Локаль перевода',
    example: Lang.ru,
    enum: Lang,
  })
  @IsNotEmpty()
  @IsEnum(Lang)
  lang!: Lang;

  @ApiProperty({
    example: 'Успешный',
    ...apiSetLength(3, 200),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  iconName!: string;

  @ApiProperty({
    example: 'Подпись к открытой иконке',
    ...apiSetLength(3, 2000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2000)
  iconCaption!: string;

  @ApiProperty({
    example: 'Подпись к закрытой иконке',
    ...apiSetLength(3, 2000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2000)
  iconClosedCaption!: string;

  @ApiProperty({
    example: 'Подпись к новой иконке',
    ...apiSetLength(3, 2000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2000)
  iconNewCaption!: string;

  @ApiProperty({
    type: [String],
    description:
      'Упорядоченный список строк для подписей к балансу, ровно 11 элементов. Длина каждого элемента в пределах: [3, 2000]',
    minItems: 11,
    maxItems: 11,
  })
  @IsNotEmpty()
  @Length(3, 2000, { each: true })
  @IsString({ each: true })
  @ArrayMinSize(11)
  @ArrayMaxSize(11)
  balanceCaptions!: string[];
}

export class HabitCategoryBalanceCreateReqDto {
  @ApiProperty({ description: 'ID фото для иконки категории баланса' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  photoId!: number;

  @ApiProperty({
    type: [HabitCategoryBalanceI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HabitCategoryBalanceI18nReqDto)
  translations!: HabitCategoryBalanceI18nReqDto[];
}
