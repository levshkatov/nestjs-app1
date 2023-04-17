import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { HabitDaypart } from '../../../../orm/modules/habits/interfaces/habit-daypart.enum';
import { TaskCategoryName } from '../../../../orm/modules/tasks/categories/interfaces/task-category.enum';
import {
  IsArray,
  IsEnum,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from '../../../../shared/class-validator';
import { IsTime } from '../../../../shared/decorators/is-time.decorator';
import { PagesDto } from '../../../../shared/dtos/page.dto';
import { apiSetLength } from '../../../../shared/helpers/api-set-length.helper';
import { booleanTransformer } from '../../../../shared/helpers/boolean-transformer.helper';
import { Lang } from '../../../../shared/interfaces/lang.enum';
import { ObjectLinkedDto } from '../../../shared/dtos/object-linked.dto';

class HabitBaseDto {
  @ApiProperty()
  id!: number;

  @ApiPropertyOptional()
  tag?: string;

  @ApiProperty()
  disabled!: boolean;

  @ApiProperty({ type: ObjectLinkedDto })
  category!: ObjectLinkedDto;

  @ApiProperty({ type: ObjectLinkedDto })
  task!: ObjectLinkedDto;

  @ApiProperty({ enum: HabitDaypart })
  daypart!: HabitDaypart;

  @ApiProperty({ description: 'Время привычки в формате HH:mm:ss' })
  time!: string;
}

export class HabitForListDto extends HabitBaseDto {
  @ApiProperty()
  name!: string;
}

export class HabitsForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [HabitForListDto] })
  habits!: HabitForListDto[];
}

export class HabitI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  daypartDescription!: string;

  @ApiProperty()
  goal!: string;

  @ApiProperty()
  forWhom!: string;
}

export class HabitDetailedDto extends HabitBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [HabitI18nDto] })
  translations!: HabitI18nDto[];

  @ApiProperty({ type: [ObjectLinkedDto] })
  linked!: ObjectLinkedDto[];
}

export class HabitsReqDto {
  @ApiPropertyOptional({
    ...apiSetLength(3, 200),
  })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  tag?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(booleanTransformer)
  disabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  categoryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taskId?: number;

  @ApiPropertyOptional({
    ...apiSetLength(3, 200),
  })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  taskName?: string;

  @ApiPropertyOptional({ enum: TaskCategoryName })
  @IsOptional()
  @IsEnum(TaskCategoryName)
  taskCategoryName?: TaskCategoryName;

  @ApiPropertyOptional({
    ...apiSetLength(3, 200),
  })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  name?: string;

  @ApiPropertyOptional({ enum: HabitDaypart })
  @IsOptional()
  @IsEnum(HabitDaypart)
  daypart?: HabitDaypart;
}

export class HabitsSimpleReqDto {
  @ApiPropertyOptional({ description: 'По умолчанию false' })
  @IsOptional()
  @Transform(booleanTransformer)
  disabled?: boolean;
}

export class HabitI18nReqDto {
  @ApiProperty({
    description: 'Локаль перевода',
    example: Lang.ru,
    enum: Lang,
  })
  @IsNotEmpty()
  @IsEnum(Lang)
  lang!: Lang;

  @ApiProperty({
    ...apiSetLength(3, 200),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  name!: string;

  @ApiProperty({
    ...apiSetLength(3, 2000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2000)
  description!: string;

  @ApiProperty({
    ...apiSetLength(3, 2000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2000)
  daypartDescription!: string;

  @ApiProperty({
    ...apiSetLength(3, 2000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2000)
  goal!: string;

  @ApiProperty({
    ...apiSetLength(3, 2000),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 2000)
  forWhom!: string;
}

export class HabitCreateReqDto {
  @ApiPropertyOptional({
    ...apiSetLength(3, 200, 'Уникальный тег'),
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  tag?: string;

  @ApiProperty({
    description: 'ID категории привычки',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  categoryId!: number;

  @ApiProperty({
    description: 'ID задания',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  taskId!: number;

  @ApiProperty({
    description: 'Время суток',
    enum: HabitDaypart,
  })
  @IsEnum(HabitDaypart)
  @IsNotEmpty()
  daypart!: HabitDaypart;

  @ApiPropertyOptional({
    description:
      'Время привычки в формате HH:mm. Если не указано, то стандартное, в зависимости от времени суток',
  })
  @IsOptional()
  @IsMilitaryTime()
  time!: string;

  @ApiPropertyOptional({
    description: 'Время обратного отсчета для привычки с таймером, в формате HH:mm:ss',
  })
  @IsOptional()
  @IsTime()
  countdown?: string;

  @ApiProperty({
    type: [HabitI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HabitI18nReqDto)
  translations!: HabitI18nReqDto[];
}

export class HabitEditReqDto extends HabitCreateReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(booleanTransformer)
  disabled?: boolean;
}
