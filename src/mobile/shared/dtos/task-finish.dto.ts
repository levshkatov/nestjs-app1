import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HabitCategoryBalanceNewDto } from '../../modules/habits/categories/balances/dtos/habit-category-balance.dto';
import { LotusDto } from '../../modules/lotus/dtos/lotus.dto';
import { TaskFinishScreen } from '../interfaces/task-finish-screen.enum';
import { PhotoDto } from '../../../shared/modules/media/dtos/photo.dto';
import { LevelDto } from '../../modules/levels/dtos/level.dto';
import { TreeDto } from '../../modules/trees/dtos/tree.dto';

export class TaskFinishDto {
  @ApiProperty({
    description: 'Тип анимированного экрана',
    enum: TaskFinishScreen,
  })
  screenType!: TaskFinishScreen;

  @ApiPropertyOptional({
    description: 'Если присутствует, то после нажатия на крестик, нужно рисовать анимацию лотоса',
    type: LotusDto,
  })
  lotus?: LotusDto;

  @ApiPropertyOptional({
    description:
      'Если присутствует, то после поздравления и лотоса (если он есть), нужно показывать экран с новым разблокированным персонажем',
    type: HabitCategoryBalanceNewDto,
  })
  newBalance?: HabitCategoryBalanceNewDto;

  @ApiPropertyOptional({
    description:
      'Если присутствует, то после поздравления и лотоса (если он есть), нужно показывать экран с новым деревом',
    type: TreeDto,
  })
  newTree?: TreeDto;

  @ApiPropertyOptional({
    description:
      'Если присутствует, то после поздравления и лотоса (если он есть), нужно показывать экран с новым уровнем',
    type: LevelDto,
  })
  newLevel?: LevelDto;

  @ApiPropertyOptional({
    description:
      'Если присутствует, то после поздравления и лотоса (если он есть), нужно показывать экран с выполненным курсом',
    type: PhotoDto,
  })
  courseFinished?: PhotoDto;

  @ApiPropertyOptional({
    description:
      'Если true, то после поздравления и древа (если оно есть), нужно показывать экран "Открыт новый уровень"',
  })
  courseStepFinished?: boolean;
}
