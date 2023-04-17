import { ApiProperty } from '@nestjs/swagger';
import { PhotoDto } from '../../../../shared/modules/media/dtos/photo.dto';

export class TreeDto {
  @ApiProperty()
  index!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;
}
