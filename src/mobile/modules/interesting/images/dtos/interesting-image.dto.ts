import { ApiProperty } from '@nestjs/swagger';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';

export class InterestingImageForListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;
}
