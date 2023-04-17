import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from '../../../../../shared/class-validator';
import { PagesDto } from '../../../../../shared/dtos/page.dto';
import { booleanTransformer } from '../../../../../shared/helpers/boolean-transformer.helper';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';
import { ObjectLinkedDto } from '../../../../shared/dtos/object-linked.dto';

class InterestingCoachingBaseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  disabled!: boolean;

  @ApiProperty({ type: ObjectLinkedDto })
  category!: ObjectLinkedDto;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;

  @ApiProperty({ type: ObjectLinkedDto })
  exercise!: ObjectLinkedDto;
}

export class InterestingCoachingForListDto extends InterestingCoachingBaseDto {}

export class InterestingCoachingsForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [InterestingCoachingForListDto] })
  interestingCoachings!: InterestingCoachingForListDto[];
}

export class InterestingCoachingDetailedDto extends InterestingCoachingBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;
}

export class InterestingCoachingsReqDto {}

export class InterestingCoachingCreateReqDto {
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

  @ApiProperty({ description: 'ID упражнения' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  exerciseId!: number;
}

export class InterestingCoachingEditReqDto extends InterestingCoachingCreateReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(booleanTransformer)
  disabled?: boolean;
}
