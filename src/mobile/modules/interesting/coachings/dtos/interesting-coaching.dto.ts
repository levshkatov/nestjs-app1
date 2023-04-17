import { ApiProperty } from '@nestjs/swagger';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';
import { TaskDto } from '../../../tasks/dtos/task.dto';
import { InterestingGroupByCategoryDto } from '../../dtos/interesting.dto';

export class InterestingCoachingGroupByCategoryDto extends InterestingGroupByCategoryDto {}

export class InterestingCoachingForListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;
}

export class TaskForCoachingDto extends TaskDto {
  @ApiProperty()
  index!: number;
}

export class InterestingCoachingDetailedDto {
  @ApiProperty()
  interestingCoachingId!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  goal!: string;

  @ApiProperty()
  author!: string;

  @ApiProperty()
  source!: string;

  @ApiProperty({ type: [TaskForCoachingDto] })
  tasks!: TaskForCoachingDto[];
}
