import { ApiProperty } from '@nestjs/swagger';
import { AudioDto } from '../../../../../shared/modules/media/dtos/audio.dto';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';

export class InterestingMeditationItemDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;
}

export class InterestingMeditationGroupByCategoryDto {
  @ApiProperty({ description: 'Заголовок категории интересного' })
  groupTitle!: string;

  @ApiProperty({ type: [InterestingMeditationItemDto] })
  items!: InterestingMeditationItemDto[];
}

export class InterestingMeditationDetailedDto {
  @ApiProperty()
  interestingMeditationId!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: AudioDto })
  audioFemale!: AudioDto;

  @ApiProperty({ type: AudioDto })
  audioMale!: AudioDto;
}
