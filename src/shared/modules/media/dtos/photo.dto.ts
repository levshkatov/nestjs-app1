import { ApiProperty } from '@nestjs/swagger';
import { PhotoSizeDto } from './photo-size.dto';

export class PhotoDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  src!: string;

  @ApiProperty()
  blurHash!: string;

  @ApiProperty({
    description: 'Ссылки на кадрированные изображения',
    type: PhotoSizeDto,
  })
  resized!: PhotoSizeDto;
}
