import { ApiProperty } from '@nestjs/swagger';
import { PhotoDto } from '../../../../../shared/modules/media/dtos/photo.dto';
import { HabitCategoryDto } from '../../../habits/categories/dtos/habit-category.dto';

export class UserHabitCategoryBalanceDto extends HabitCategoryDto {
  @ApiProperty({ description: 'Текущий уровень баланса' })
  totalBalance!: number;

  @ApiProperty({ description: 'Максимальный уровень баланса' })
  maxBalance!: number;

  @ApiProperty({ description: 'true если totalBalance == maxBalance' })
  isCompleted!: boolean;

  @ApiProperty({ description: 'Надпись для подробного просмотра категории' })
  mainCaption!: string;
}

export class UserBalanceDto {
  @ApiProperty({ description: 'Текущий уровень баланса' })
  totalBalance: number;

  @ApiProperty({ description: 'Максимальный уровень баланса' })
  maxBalance: number;

  @ApiProperty({ description: 'Номер общей иконки (от 1 (только для нулевого уровня) до 10)' })
  iconNumber: number;

  @ApiProperty({ type: [UserHabitCategoryBalanceDto] })
  categories: UserHabitCategoryBalanceDto[];

  constructor({ totalBalance, maxBalance, iconNumber, categories }: UserBalanceDto) {
    this.totalBalance = totalBalance;
    this.maxBalance = maxBalance;
    this.iconNumber = iconNumber;
    this.categories = categories;
  }
}

export class UserIconDto {
  @ApiProperty()
  disabled!: boolean;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  text!: string;

  @ApiProperty({ type: PhotoDto })
  photo!: PhotoDto;
}

export class UserIconsDto {
  @ApiProperty({ type: [UserIconDto] })
  icons: UserIconDto[];

  constructor({ icons }: UserIconsDto) {
    this.icons = icons;
  }
}
