import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { CourseExtraDescriptionType } from '../../../../orm/modules/courses/interfaces/course-extra-description-type.enum';
import { CourseType } from '../../../../orm/modules/courses/interfaces/course-type.enum';
import { IsEnum, IsOptional } from '../../../../shared/class-validator';
import { booleanTransformer } from '../../../../shared/helpers/boolean-transformer.helper';
import { PhotoDto } from '../../../../shared/modules/media/dtos/photo.dto';
import { HabitForCourseDto } from '../../habits/dtos/habit.dto';

export class CourseForListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ enum: CourseType })
  type!: CourseType;

  @ApiProperty()
  disabled!: boolean;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;

  @ApiPropertyOptional({ type: PhotoDto, description: 'Только для гор' })
  photoInactive?: PhotoDto;

  @ApiPropertyOptional({
    description: 'Проходится ли курс в данный момент (Только для авторизованного запроса)',
  })
  isAdded?: boolean;

  @ApiPropertyOptional({
    description: 'Прошел ли пользователь данный курс (Только для авторизованного запроса)',
  })
  isCompleted?: boolean;
}

export class CourseExtraDescriptionDto {
  @ApiProperty()
  title!: string;

  @ApiProperty({
    enum: CourseExtraDescriptionType,
  })
  type!: CourseExtraDescriptionType;

  @ApiProperty({ type: [String] })
  description!: string[];
}

export class CourseDetailedDto extends CourseForListDto {
  @ApiProperty()
  duration!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ description: 'Блоков в массиве будет два', type: [CourseExtraDescriptionDto] })
  extraDescription!: CourseExtraDescriptionDto[];

  @ApiProperty({ description: 'Привычек будет три', type: [HabitForCourseDto] })
  habits!: HabitForCourseDto[];
}

export class CourseReqDto {
  @ApiProperty({
    description: 'Тип курса',
    enum: CourseType,
  })
  @IsEnum(CourseType)
  type!: CourseType;
}

export class CourseStartDto {
  @ApiPropertyOptional({
    description: 'Для принудительной смены курса',
  })
  @IsOptional()
  @Transform(booleanTransformer)
  forceChangeCourse?: boolean;
}

export class CourseRemoveDto {
  @ApiPropertyOptional({
    description: 'Для принудительного удаления проходимого курса',
  })
  @IsOptional()
  @Transform(booleanTransformer)
  forceRemoveCourse?: boolean;
}
