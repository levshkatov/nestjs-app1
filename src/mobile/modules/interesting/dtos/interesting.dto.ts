import { ApiProperty } from '@nestjs/swagger';
import { PhotoDto } from '../../../../shared/modules/media/dtos/photo.dto';

export class InterestingItemDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;
}

export class InterestingGroupByCategoryDto {
  @ApiProperty({ description: 'Заголовок категории интересного' })
  groupTitle!: string;

  @ApiProperty({ type: [InterestingItemDto] })
  items!: InterestingItemDto[];
}
