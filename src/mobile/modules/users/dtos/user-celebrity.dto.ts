import { ApiProperty } from '@nestjs/swagger';
import { PhotoDto } from '../../../../shared/modules/media/dtos/photo.dto';

export class UserCelebrityDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;
}
