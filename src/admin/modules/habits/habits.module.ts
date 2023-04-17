import { Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { HabitCategoriesController } from './categories/habit-categories.controller';
import { HabitCategoriesService } from './categories/habit-categories.service';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';

@Module({
  imports: [],
  controllers: [HabitCategoriesController, HabitsController],
  providers: [HabitsService, HabitCategoriesService],
})
export class HabitsModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
