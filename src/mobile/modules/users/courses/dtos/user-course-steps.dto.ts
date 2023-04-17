import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';
import { UserCourseStepState } from '../interfaces/user-course-step-state.enum';

class UserCourseStepDto {
  @ApiProperty()
  index!: number;

  @ApiProperty({ enum: UserCourseStepState })
  state!: UserCourseStepState;
}

export class UserCourseStepsDto {
  @ApiProperty({ type: [UserCourseStepDto] })
  steps!: UserCourseStepDto[];

  @ApiPropertyOptional({ type: PhotoDto, description: 'Только для категорий' })
  photo?: PhotoDto;
}
