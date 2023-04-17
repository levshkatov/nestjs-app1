import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from '../../../../../shared/class-validator';
import { PagesDto } from '../../../../../shared/dtos/page.dto';
import { booleanTransformer } from '../../../../../shared/helpers/boolean-transformer.helper';
import { Lang } from '../../../../../shared/interfaces/lang.enum';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';

class InterestingImageBaseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  disabled!: boolean;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;
}

export class InterestingImageForListDto extends InterestingImageBaseDto {}

export class InterestingImagesForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [InterestingImageForListDto] })
  interestingImages!: InterestingImageForListDto[];
}

export class InterestingImageDetailedDto extends InterestingImageBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;
}

export class InterestingImagesReqDto {}

export class InterestingImageCreateReqDto {
  @ApiProperty({ description: 'ID фото' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  photoId!: number;
}

export class InterestingImageEditReqDto extends InterestingImageCreateReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(booleanTransformer)
  disabled?: boolean;
}
