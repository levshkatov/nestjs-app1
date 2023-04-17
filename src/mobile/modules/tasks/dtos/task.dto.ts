import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DataWithTypeDto } from '../../../../shared/modules/tasks/dtos/task.dto';

export class TaskWithoutContentDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  category!: string;
}

export class TaskDto extends TaskWithoutContentDto {
  @ApiPropertyOptional({ type: [DataWithTypeDto] })
  content?: DataWithTypeDto[];
}

export class TaskWithHabitIdDto extends TaskDto {
  @ApiProperty()
  habitId!: number;
}
