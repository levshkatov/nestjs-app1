import { Module } from '@nestjs/common';
import { HabitCategoriesController } from './categories/habit-categories.controller';
import { HabitCategoriesService } from './categories/habit-categories.service';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { LevelsModule } from '../levels/levels.module';
import { TreesModule } from '../trees/trees.module';

@Module({
  imports: [TreesModule, LevelsModule],
  controllers: [HabitCategoriesController, HabitsController],
  providers: [HabitsService, HabitCategoriesService],
})
export class HabitsModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
