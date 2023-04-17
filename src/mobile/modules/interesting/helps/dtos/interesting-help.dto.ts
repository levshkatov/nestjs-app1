import { ApiProperty } from '@nestjs/swagger';
import { AudioDto } from '../../../../../shared/modules/media/dtos/audio.dto';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';

export class InterestingHelpForListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;
}

export class InterestingHelpDetailedDto {
  @ApiProperty()
  interestingHelpId!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: AudioDto })
  audio!: AudioDto;
}
