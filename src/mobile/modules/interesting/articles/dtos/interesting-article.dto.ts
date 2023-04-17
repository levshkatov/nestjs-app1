import { ApiProperty } from '@nestjs/swagger';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';
import { TaskDto } from '../../../tasks/dtos/task.dto';

export class InterestingArticleForListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;
}

export class InterestingArticleDetailedDto {
  @ApiProperty()
  interestingArticleId!: number;

  @ApiProperty({ type: TaskDto })
  task!: TaskDto;
}
