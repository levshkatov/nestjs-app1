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

class InterestingArticleBaseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  disabled!: boolean;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;

  @ApiProperty({ type: ObjectLinkedDto })
  task!: ObjectLinkedDto;
}

export class InterestingArticleForListDto extends InterestingArticleBaseDto {
  @ApiProperty()
  title!: string;
}

export class InterestingArticlesForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [InterestingArticleForListDto] })
  interestingArticles!: InterestingArticleForListDto[];
}

export class InterestingArticleI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  title!: string;
}

export class InterestingArticleDetailedDto extends InterestingArticleBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [InterestingArticleI18nDto] })
  translations!: InterestingArticleI18nDto[];
}

export class InterestingArticlesReqDto {}

export class InterestingArticleI18nReqDto {
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

export class InterestingArticleCreateReqDto {
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
    type: [InterestingArticleI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterestingArticleI18nReqDto)
  translations!: InterestingArticleI18nReqDto[];
}

export class InterestingArticleEditReqDto extends InterestingArticleCreateReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(booleanTransformer)
  disabled?: boolean;
}
