import { ApiProperty } from '@nestjs/swagger';
import { TaskDto } from '../../../tasks/dtos/task.dto';
import { UserCourseStepState } from '../interfaces/user-course-step-state.enum';

class UserCourseExerciseDto {
  @ApiProperty()
  index!: number;

  @ApiProperty({ enum: UserCourseStepState })
  state!: UserCourseStepState;
}

export class UserCourseExercisesDto {
  @ApiProperty({ description: 'ID актуального упражнения. Чтобы открыть по клику' })
  currentExerciseId!: number;

  @ApiProperty({ type: [UserCourseExerciseDto] })
  exercises!: UserCourseExerciseDto[];
}

export class TaskForCourseDto extends TaskDto {
  @ApiProperty()
  index!: number;
}

export class UserCourseExerciseFullDto {
  @ApiProperty({ description: 'ID упражнения. Чтобы отправить запрос finish' })
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  goal!: string;

  @ApiProperty()
  author!: string;

  @ApiProperty()
  source!: string;

  @ApiProperty({ type: [TaskForCourseDto] })
  tasks!: TaskForCourseDto[];
}
