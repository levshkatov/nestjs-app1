import { Global, Module } from '@nestjs/common';
import { logClassName } from '../../shared/helpers/log-classname.helper';
import { CelebritiesMapper } from './celebrities/celebrities.mapper';
import { CoursesMapper } from './courses/courses.mapper';
import { HabitCategoryBalancesMapper } from './habits/categories/balances/habit-category-balances.mapper';
import { HabitCategoriesMapper } from './habits/categories/habit-categories.mapper';
import { HabitsMapper } from './habits/habits.mapper';
import { InterestingArticlesMapper } from './interesting/articles/interesting-articles.mapper';
import { InterestingAudiosMapper } from './interesting/audios/interesting-audios.mapper';
import { InterestingChecklistsMapper } from './interesting/checklists/interesting-checklists.mapper';
import { InterestingCoachingsMapper } from './interesting/coachings/interesting-coachings.mapper';
import { InterestingHelpsMapper } from './interesting/helps/interesting-helps.mapper';
import { InterestingImagesMapper } from './interesting/images/interesting-images.mapper';
import { InterestingMeditationsMapper } from './interesting/meditations/interesting-meditations.mapper';
import { LevelsMapper } from './levels/levels.mapper';
import { LotusMapper } from './lotus/lotus.mapper';
import { MediaMapper } from './media/media.mapper';
import { SubscriptionsMapper } from './subscriptions/subscriptions.mapper';
import { TasksMapper } from './tasks/tasks.mapper';
import { TreesMapper } from './trees/trees.mapper';
import { UserBalancesMapper } from './users/balances/user-balances.mapper';
import { UserCoursesMapper } from './users/courses/user-courses.mapper';
import { UserHabitsMapper } from './users/habits/user-habits.mapper';
import { UserLettersMapper } from './users/letters/user-letters.mapper';
import { UsersMapper } from './users/users.mapper';

const mappers = [
  CelebritiesMapper,
  CoursesMapper,
  HabitsMapper,
  HabitCategoriesMapper,
  HabitCategoryBalancesMapper,
  InterestingArticlesMapper,
  InterestingAudiosMapper,
  InterestingChecklistsMapper,
  InterestingCoachingsMapper,
  InterestingHelpsMapper,
  InterestingImagesMapper,
  InterestingMeditationsMapper,
  LotusMapper,
  MediaMapper,
  SubscriptionsMapper,
  TasksMapper,
  UsersMapper,
  UserBalancesMapper,
  UserCoursesMapper,
  UserHabitsMapper,
  UserLettersMapper,
  LevelsMapper,
  TreesMapper,
];

@Global()
@Module({
  imports: [],
  providers: mappers,
  exports: mappers,
})
export class MobileMappersModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
