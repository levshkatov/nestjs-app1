import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseType } from '../../../../../orm/modules/courses/interfaces/course-type.enum';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';
import { UserCourseStepState } from '../interfaces/user-course-step-state.enum';

export class UserCourseStepExerciseTaskDto {
  @ApiProperty()
  index!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  isCompleted!: boolean;
}

export class UserCourseStepExerciseDto {
  @ApiProperty()
  index!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  isCompleted!: boolean;

  @ApiProperty({ type: [UserCourseStepExerciseTaskDto] })
  tasks!: UserCourseStepExerciseTaskDto[];
}

export class UserCourseStepDto {
  @ApiProperty()
  index!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ enum: UserCourseStepState })
  state!: UserCourseStepState;

  @ApiProperty()
  exercisesCompleted!: number;

  @ApiProperty()
  exercisesTotal!: number;

  @ApiProperty()
  percent!: number;

  @ApiProperty({ type: [UserCourseStepExerciseDto] })
  exercises!: UserCourseStepExerciseDto[];

  @ApiPropertyOptional({ type: PhotoDto, description: 'Только для категорий' })
  photo?: PhotoDto;
}

export class UserCourseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ enum: CourseType })
  type!: CourseType;

  @ApiProperty({ description: 'Индекс текущего шага пользователя' })
  currentStepIndex!: number;

  @ApiProperty({ type: [UserCourseStepDto] })
  steps!: UserCourseStepDto[];
}
