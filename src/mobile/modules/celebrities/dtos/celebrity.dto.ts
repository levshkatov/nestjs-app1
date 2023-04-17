import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from '../../../../shared/class-validator';
import { booleanTransformer } from '../../../../shared/helpers/boolean-transformer.helper';
import { PhotoDto } from '../../../../shared/modules/media/dtos/photo.dto';
import { HabitForCelebrityDto } from '../../habits/dtos/habit.dto';

export class CelebrityForListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  caption!: string;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;

  @ApiPropertyOptional({
    description: 'Проходится ли знаменитость в данный момент (Только для авторизованного запроса)',
  })
  isAdded?: boolean;
}

export class CelebrityDetailedDto extends CelebrityForListDto {
  @ApiProperty({ type: [HabitForCelebrityDto] })
  habits!: HabitForCelebrityDto[];
}

export class CelebrityStartDto {
  @ApiPropertyOptional({
    description: 'Для принудительной старта прохождения знаменитости',
  })
  @IsOptional()
  @Transform(booleanTransformer)
  force?: boolean;
}

export class CelebrityRemoveDto {
  @ApiPropertyOptional({
    description: 'Для принудительного удаления прохождения знаменитости',
  })
  @IsOptional()
  @Transform(booleanTransformer)
  force?: boolean;
}
