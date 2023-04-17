import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  Length,
  Min,
  ValidateNested,
} from '../../../../../shared/class-validator';
import { PagesDto } from '../../../../../shared/dtos/page.dto';
import { apiSetLength } from '../../../../../shared/helpers/api-set-length.helper';
import { Lang } from '../../../../../shared/interfaces/lang.enum';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';
import {
  HabitCategoryBalanceCreateReqDto,
  HabitCategoryBalanceDetailedDto,
  HabitCategoryBalanceForListDto,
} from './habit-category-balance.dto';

class HabitCategoryBaseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;
}

export class HabitCategoryForListDto extends HabitCategoryBaseDto {
  @ApiProperty()
  name!: string;

  @ApiProperty({ type: HabitCategoryBalanceForListDto })
  balance!: HabitCategoryBalanceForListDto;
}

export class HabitCategoriesForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [HabitCategoryForListDto] })
  categories!: HabitCategoryForListDto[];
}

export class HabitCategoryI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  habitCaption!: string;
}

export class HabitCategoryDetailedDto extends HabitCategoryBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [HabitCategoryI18nDto] })
  translations!: HabitCategoryI18nDto[];

  @ApiProperty({ type: HabitCategoryBalanceDetailedDto })
  balance!: HabitCategoryBalanceDetailedDto;
}

export class HabitCategoryI18nReqDto {
  @ApiProperty({
    description: 'Локаль перевода',
    example: Lang.ru,
    enum: Lang,
  })
  @IsNotEmpty()
  @IsEnum(Lang)
  lang!: Lang;

  @ApiProperty({
    example: 'Карьера',
    ...apiSetLength(3, 200),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  name!: string;

  @ApiProperty({
    example: 'Подпись для привычек',
    ...apiSetLength(3, 2000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2000)
  habitCaption!: string;
}

export class HabitCategoryCreateReqDto {
  @ApiProperty({ description: 'ID фото для категории привычек' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  photoId!: number;

  @ApiProperty({
    type: [HabitCategoryI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HabitCategoryI18nReqDto)
  translations!: HabitCategoryI18nReqDto[];

  @ApiProperty({ type: HabitCategoryBalanceCreateReqDto })
  @IsNotEmpty()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => HabitCategoryBalanceCreateReqDto)
  balance!: HabitCategoryBalanceCreateReqDto;
}

export class HabitCategoryEditReqDto extends HabitCategoryCreateReqDto {}
