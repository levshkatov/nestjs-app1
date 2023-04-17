import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { TaskCategoryName } from '../../../../orm/modules/tasks/categories/interfaces/task-category.enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from '../../../../shared/class-validator';
import { PagesDto } from '../../../../shared/dtos/page.dto';
import { apiSetLength } from '../../../../shared/helpers/api-set-length.helper';
import { booleanTransformer } from '../../../../shared/helpers/boolean-transformer.helper';
import { Lang } from '../../../../shared/interfaces/lang.enum';
import { ContentReqDto, DataWithTypeDto } from '../../../../shared/modules/tasks/dtos/task.dto';
import { ObjectLinkedDto } from '../../../shared/dtos/object-linked.dto';
import { TaskCategoriesReqDto } from '../categories/dtos/task-category.dto';

class TaskBaseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: TaskCategoryName })
  categoryName!: TaskCategoryName;

  @ApiProperty()
  forHabits!: boolean;

  @ApiProperty()
  forExercises!: boolean;

  @ApiProperty({
    description: 'Объекты связанные с заданием',
    type: [ObjectLinkedDto],
  })
  linked!: ObjectLinkedDto[];
}

export class TaskForListDto extends TaskBaseDto {}

export class TasksForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [TaskForListDto] })
  tasks!: TaskForListDto[];
}

export class TaskI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty({ type: [DataWithTypeDto] })
  content!: DataWithTypeDto[];
}

export class TaskDetailedDto extends TaskBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [TaskI18nDto] })
  translations!: TaskI18nDto[];
}

export class TasksReqDto extends TaskCategoriesReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  id?: number;

  @ApiPropertyOptional({
    ...apiSetLength(3, 200),
  })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  name?: string;

  @ApiPropertyOptional({
    description: 'Категория задания',
    enum: TaskCategoryName,
  })
  @IsOptional()
  @IsEnum(TaskCategoryName)
  categoryName?: TaskCategoryName;

  @ApiPropertyOptional({ description: 'Несвязанные задания. По умолчанию false' })
  @IsOptional()
  @Transform(booleanTransformer)
  notLinked?: boolean = false;
}

class TaskI18nReqDto extends ContentReqDto {
  @ApiProperty({
    description: 'Локаль перевода',
    example: Lang.ru,
    enum: Lang,
  })
  @IsNotEmpty()
  @IsEnum(Lang)
  lang!: Lang;
}

export class TaskEditReqDto {
  @ApiProperty({
    example: 'Крис Хемсворт',
    ...apiSetLength(3, 200),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  name!: string;

  @ApiProperty({
    type: [TaskI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskI18nReqDto)
  translations!: TaskI18nReqDto[];
}

export class TaskCreateReqDto extends TaskEditReqDto {
  @ApiProperty({
    description: 'Категория задания',
    enum: TaskCategoryName,
  })
  @IsEnum(TaskCategoryName)
  categoryName!: TaskCategoryName;
}
