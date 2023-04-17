import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { InterestingCategoryType } from '../../../../../orm/modules/interesting/categories/interfaces/interesting-category-type.enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from '../../../../../shared/class-validator';
import { PagesDto } from '../../../../../shared/dtos/page.dto';
import { apiSetLength } from '../../../../../shared/helpers/api-set-length.helper';
import { Lang } from '../../../../../shared/interfaces/lang.enum';

class InterestingCategoryBaseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ enum: InterestingCategoryType })
  type!: InterestingCategoryType;
}

export class InterestingCategoryForListDto extends InterestingCategoryBaseDto {
  @ApiProperty()
  title!: string;
}

export class InterestingCategoriesForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [InterestingCategoryForListDto] })
  interestingCategories!: InterestingCategoryForListDto[];
}

export class InterestingCategoryI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  title!: string;
}

export class InterestingCategoryDetailedDto extends InterestingCategoryBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [InterestingCategoryI18nDto] })
  translations!: InterestingCategoryI18nDto[];
}

export class InterestingCategoriesReqDto {}

export class InterestingCategoriesSimpleReqDto {
  @ApiPropertyOptional({
    description: 'Тип категории интересного',
    enum: InterestingCategoryType,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(InterestingCategoryType)
  type?: InterestingCategoryType;
}

export class InterestingCategoryI18nReqDto {
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

export class InterestingCategoryCreateReqDto {
  @ApiProperty({
    enum: InterestingCategoryType,
  })
  @IsEnum(InterestingCategoryType)
  @IsNotEmpty()
  type!: InterestingCategoryType;

  @ApiProperty({
    type: [InterestingCategoryI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterestingCategoryI18nReqDto)
  translations!: InterestingCategoryI18nReqDto[];
}

export class InterestingCategoryEditReqDto extends InterestingCategoryCreateReqDto {}
