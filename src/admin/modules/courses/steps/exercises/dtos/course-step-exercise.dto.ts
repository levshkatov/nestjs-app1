import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from '../../../../../../shared/class-validator';
import { ObjectLinkedDto } from '../../../../../shared/dtos/object-linked.dto';

class CourseStepExerciseBaseDto {
  @ApiProperty()
  index!: number;

  @ApiProperty({ type: ObjectLinkedDto })
  exercise!: ObjectLinkedDto;
}

export class CourseStepExerciseForListDto extends CourseStepExerciseBaseDto {}

export class CourseStepExercisesForListDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [CourseStepExerciseForListDto] })
  courseStepExercises!: CourseStepExerciseForListDto[];
}

export class CourseStepExerciseDetailedDto extends CourseStepExerciseBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty()
  exerciseId!: number;
}

export class CourseStepExerciseCreateReqDto {
  @ApiProperty({
    description: 'Индекс упражнения. Если 0 то добавится в конец',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  index!: number;

  @ApiProperty({
    description: 'ID упражнения',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  exerciseId!: number;
}

export class CourseStepExerciseEditReqDto extends CourseStepExerciseCreateReqDto {}

export class ParamCourseStepIndexReqDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  stepIndex!: number;
}
