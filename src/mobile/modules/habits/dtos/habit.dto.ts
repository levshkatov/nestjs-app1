import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { HabitDaypart } from '../../../../orm/modules/habits/interfaces/habit-daypart.enum';
import { IsNumber, IsOptional, Min } from '../../../../shared/class-validator';
import { IsTime } from '../../../../shared/decorators/is-time.decorator';
import { booleanTransformer } from '../../../../shared/helpers/boolean-transformer.helper';
import { PhotoDto } from '../../../../shared/modules/media/dtos/photo.dto';
export class HabitForListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ enum: HabitDaypart })
  daypart!: HabitDaypart;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;

  @ApiPropertyOptional({
    description: 'Добавлена ли привычка в распорядок дня (Только для авторизованного запроса)',
  })
  isAdded?: boolean;
}

export class HabitDetailedDto extends HabitForListDto {
  @ApiProperty()
  description!: string;

  @ApiProperty({ description: 'Название времени дня' })
  daypartDescription!: string;

  @ApiProperty({ description: 'Цель' })
  goal!: string;

  @ApiProperty({ description: 'Для кого' })
  forWhom!: string;

  @ApiProperty({
    description: 'Подпись, общая для всех привычек из одной категории, в дизайне она снизу',
  })
  categoryCaption!: string;
}

export class HabitForCelebrityDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;
}

export class HabitForCourseDto extends HabitForCelebrityDto {}

export class HabitsReqDto {
  @ApiPropertyOptional({
    description: 'Выбрать все привычки по id категории',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Выбрать одну произвольную привычку',
  })
  @IsOptional()
  @Transform(booleanTransformer)
  randomOne?: boolean;
}

export class HabitAddChallengeDto {
  @ApiPropertyOptional({
    description: 'Для принудительной смены челленджа',
  })
  @IsOptional()
  @Transform(booleanTransformer)
  forceChangeChallenge?: boolean;
}

export class HabitSetTimeDto {
  @ApiProperty({
    description: 'Время привычки в формате HH:mm:ss',
  })
  @IsTime()
  time!: string;
}
