import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseType } from '../../../../../orm/modules/courses/interfaces/course-type.enum';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';

export class UserCourseSimpleDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ enum: CourseType })
  type!: CourseType;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({ type: PhotoDto, description: 'Только для категорий' })
  photo?: PhotoDto;
}
