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

class InterestingAudioBaseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  disabled!: boolean;

  @ApiProperty({ type: AudioDto })
  audio!: AudioDto;
}

export class InterestingAudioForListDto extends InterestingAudioBaseDto {
  @ApiProperty()
  title!: string;
}

export class InterestingAudiosForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [InterestingAudioForListDto] })
  interestingAudios!: InterestingAudioForListDto[];
}

export class InterestingAudioI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  title!: string;
}

export class InterestingAudioDetailedDto extends InterestingAudioBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [InterestingAudioI18nDto] })
  translations!: InterestingAudioI18nDto[];
}

export class InterestingAudiosReqDto {}

export class InterestingAudioI18nReqDto {
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

export class InterestingAudioCreateReqDto {
  @ApiProperty({ description: 'ID аудио' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  audioId!: number;

  @ApiProperty({
    type: [InterestingAudioI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterestingAudioI18nReqDto)
  translations!: InterestingAudioI18nReqDto[];
}

export class InterestingAudioEditReqDto extends InterestingAudioCreateReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(booleanTransformer)
  disabled?: boolean;
}
