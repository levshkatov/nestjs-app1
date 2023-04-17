import { Global, Module } from '@nestjs/common';
import { logClassName } from '../../shared/helpers/log-classname.helper';
import { CelebritiesMapper } from './celebrities/celebrities.mapper';
import { CoursesMapper } from './courses/courses.mapper';
import { CourseStepsMapper } from './courses/steps/course-steps.mapper';
import { CourseStepExercisesMapper } from './courses/steps/exercises/course-step-exercises.mapper';
import { ExercisesMapper } from './exercises/exercises.mapper';
import { ExerciseTasksMapper } from './exercises/tasks/exercise-tasks.mapper';
import { HabitCategoriesMapper } from './habits/categories/habit-categories.mapper';
import { HabitsMapper } from './habits/habits.mapper';
import { InterestingArticlesMapper } from './interesting/articles/interesting-articles.mapper';
import { InterestingAudiosMapper } from './interesting/audios/interesting-audios.mapper';
import { InterestingCategoriesMapper } from './interesting/categories/interesting-categories.mapper';
import { InterestingChecklistsMapper } from './interesting/checklists/interesting-checklists.mapper';
import { InterestingCoachingsMapper } from './interesting/coachings/interesting-coachings.mapper';
import { InterestingHelpsMapper } from './interesting/helps/interesting-helps.mapper';
import { InterestingImagesMapper } from './interesting/images/interesting-images.mapper';
import { InterestingMeditationsMapper } from './interesting/meditations/interesting-meditations.mapper';
import { LettersMapper } from './letters/letters.mapper';
import { LinkedObjectsMapper } from './linked-objects.mapper';
import { MediaMapper } from './media/media.mapper';
import { NotificationsMapper } from './notifications/notifications.mapper';
import { TaskCategoriesMapper } from './tasks/categories/task-categories.mapper';
import { TasksMapper } from './tasks/tasks.mapper';
import { TaskTypesMapper } from './tasks/types/task-types.mapper';
import { UsersMapper } from './users/users.mapper';

const mappers = [
  CelebritiesMapper,
  CoursesMapper,
  CourseStepsMapper,
  CourseStepExercisesMapper,
  ExercisesMapper,
  ExerciseTasksMapper,
  LettersMapper,
  HabitsMapper,
  HabitCategoriesMapper,
  InterestingArticlesMapper,
  InterestingAudiosMapper,
  InterestingCategoriesMapper,
  InterestingChecklistsMapper,
  InterestingCoachingsMapper,
  InterestingHelpsMapper,
  InterestingImagesMapper,
  InterestingMeditationsMapper,
  LinkedObjectsMapper,
  MediaMapper,
  NotificationsMapper,
  TasksMapper,
  TaskCategoriesMapper,
  TaskTypesMapper,
  UsersMapper,
];

@Global()
@Module({
  imports: [],
  providers: mappers,
  exports: mappers,
})
export class AdminMappersModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
