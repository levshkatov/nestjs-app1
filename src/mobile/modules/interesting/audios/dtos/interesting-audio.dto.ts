import { ApiProperty } from '@nestjs/swagger';
import { AudioDto } from '../../../../../shared/modules/media/dtos/audio.dto';

export class InterestingAudioForListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;
}

export class InterestingAudioDetailedDto {
  @ApiProperty()
  interestingAudioId!: number;

  @ApiProperty({ type: AudioDto })
  audio!: AudioDto;
}
