import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from '../../../../../shared/class-validator';
import { ObjectLinkedDto } from '../../../../shared/dtos/object-linked.dto';

class ExerciseTaskBaseDto {
  @ApiProperty()
  index!: number;

  @ApiProperty({ type: ObjectLinkedDto })
  task!: ObjectLinkedDto;
}

export class ExerciseTaskForListDto extends ExerciseTaskBaseDto {}

export class ExercisesTasksForListDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [ExerciseTaskForListDto] })
  tasks!: ExerciseTaskForListDto[];
}

export class ExerciseTaskDetailedDto extends ExerciseTaskBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty()
  taskId!: number;
}

export class ExerciseTaskCreateReqDto {
  @ApiProperty({
    description: 'Индекс задания. Если 0 то добавится в конец',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  index!: number;

  @ApiProperty({
    description: 'ID задания',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  taskId!: number;
}

export class ExerciseTaskEditReqDto extends ExerciseTaskCreateReqDto {}

export class ParamExerciseIdReqDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  exerciseId!: number;
}
