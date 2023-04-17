import { ApiProperty } from '@nestjs/swagger';
import { PhotoDto } from '../../../../../../shared/modules/media/dtos/photo.dto';

export class HabitCategoryBalanceNewDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  text!: string;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;
}
