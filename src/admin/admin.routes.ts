import { Routes } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { CelebritiesModule } from './modules/celebrities/celebrities.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { HabitsModule } from './modules/habits/habits.module';
import { InterestingArticlesModule } from './modules/interesting/articles/interesting-articles.module';
import { InterestingAudiosModule } from './modules/interesting/audios/interesting-audios.module';
import { InterestingCategoriesModule } from './modules/interesting/categories/interesting-categories.module';
import { InterestingChecklistsModule } from './modules/interesting/checklists/interesting-checklists.module';
import { InterestingCoachingsModule } from './modules/interesting/coachings/interesting-coachings.module';
import { InterestingHelpsModule } from './modules/interesting/helps/interesting-helps.module';
import { InterestingImagesModule } from './modules/interesting/images/interesting-images.module';
import { InterestingMeditationsModule } from './modules/interesting/meditations/interesting-meditations.module';
import { LettersModule } from './modules/letters/letters.module';
import { MediaModule } from './modules/media/media.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';

export const adminRoutes: Routes = [
  {
    path: 'auth',
    module: AuthModule,
  },
  {
    path: 'celebrities',
    module: CelebritiesModule,
  },
  {
    path: 'courses',
    module: CoursesModule,
  },
  {
    path: 'exercises',
    module: ExercisesModule,
  },
  {
    path: 'habits',
    module: HabitsModule,
  },
  {
    path: 'interesting/articles',
    module: InterestingArticlesModule,
  },
  {
    path: 'interesting/audios',
    module: InterestingAudiosModule,
  },
  {
    path: 'interesting/categories',
    module: InterestingCategoriesModule,
  },
  {
    path: 'interesting/checklists',
    module: InterestingChecklistsModule,
  },
  {
    path: 'interesting/coachings',
    module: InterestingCoachingsModule,
  },
  {
    path: 'interesting/helps',
    module: InterestingHelpsModule,
  },
  {
    path: 'interesting/images',
    module: InterestingImagesModule,
  },
  {
    path: 'interesting/meditations',
    module: InterestingMeditationsModule,
  },
  {
    path: 'letters',
    module: LettersModule,
  },
  {
    path: 'media',
    module: MediaModule,
  },
  {
    path: 'notifications',
    module: NotificationsModule,
  },
  {
    path: 'tasks',
    module: TasksModule,
  },
  {
    path: 'users',
    module: UsersModule,
  },
];
