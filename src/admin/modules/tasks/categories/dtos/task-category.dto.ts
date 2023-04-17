import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TaskCategoryName } from '../../../../../orm/modules/tasks/categories/interfaces/task-category.enum';
import { IsEnum, IsOptional } from '../../../../../shared/class-validator';
import { booleanTransformer } from '../../../../../shared/helpers/boolean-transformer.helper';
import { TaskTypeDetailedDto } from '../../types/dtos/task-type.dto';

export class TaskCategoryDto {
  @ApiProperty()
  name!: string;

  @ApiProperty({
    type: [TaskTypeDetailedDto],
    description: 'TaskTypes которые могут быть в данной категории',
  })
  taskTypes!: TaskTypeDetailedDto[];
}

export class TaskCategoriesReqDto {
  @ApiPropertyOptional({ description: 'Для привычек' })
  @IsOptional()
  @Transform(booleanTransformer)
  forHabits?: boolean;

  @ApiPropertyOptional({ description: 'Для упражнений' })
  @IsOptional()
  @Transform(booleanTransformer)
  forExercises?: boolean;
}

export class TaskCategoryReqDto {
  @ApiProperty({
    description: 'Категория задания',
    enum: TaskCategoryName,
  })
  @IsEnum(TaskCategoryName)
  name!: TaskCategoryName;
}
