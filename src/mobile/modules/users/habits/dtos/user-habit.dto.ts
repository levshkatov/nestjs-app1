import { ApiProperty } from '@nestjs/swagger';
import { HabitDaypart } from '../../../../../orm/modules/habits/interfaces/habit-daypart.enum';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';
import { ContentReqDto } from '../../../../../shared/modules/tasks/dtos/task.dto';

export class UserHabitDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ description: 'Время в формате HH:mm:ss' })
  time!: string;

  @ApiProperty({ enum: HabitDaypart })
  daypart!: HabitDaypart;

  @ApiProperty({
    type: [String],
    description:
      "Границы для времени привычки, в формате HH:mm:ss. Например: ['06:00:00', '12:00:00']",
  })
  daypartBoundaries!: string[];

  @ApiProperty({ description: 'Была ли выполнена привычка сегодня' })
  isCompleted!: boolean;

  @ApiProperty()
  isChallenge!: boolean;

  @ApiProperty({ description: 'Для челленджа: 0<n<=21, для привычки: 0 (игнорировать)' })
  daysRemaining!: number;

  @ApiProperty({ description: 'true: привычка из курсов, false: добавлена самостоятельно' })
  fromCourses!: boolean;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;

  @ApiProperty({ description: 'Является ли привычка простой (не нужно выполнять упражнение)' })
  isSimple!: boolean;
}

export class UserHabitDataReqDto extends ContentReqDto {}
