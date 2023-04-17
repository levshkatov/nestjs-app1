import { ApiProperty } from '@nestjs/swagger';
import { ContentReqDto } from '../../../../../shared/modules/tasks/dtos/task.dto';
import { TaskDto } from '../../../tasks/dtos/task.dto';
import { InterestingGroupByCategoryDto } from '../../dtos/interesting.dto';

export class InterestingChecklistGroupByCategoryDto extends InterestingGroupByCategoryDto {}

export class InterestingChecklistDetailedDto {
  @ApiProperty()
  interestingChecklistId!: number;

  @ApiProperty({ type: TaskDto })
  task!: TaskDto;
}

export class UserInterestingChecklistDataReqDto extends ContentReqDto {}
