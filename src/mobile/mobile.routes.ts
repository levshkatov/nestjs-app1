import { Routes } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { CelebritiesModule } from './modules/celebrities/celebrities.module';
import { CoursesModule } from './modules/courses/courses.module';
import { HabitsModule } from './modules/habits/habits.module';
import { InterestingArticlesModule } from './modules/interesting/articles/interesting-articles.module';
import { InterestingAudiosModule } from './modules/interesting/audios/interesting-audios.module';
import { InterestingChecklistsModule } from './modules/interesting/checklists/interesting-checklists.module';
import { InterestingCoachingsModule } from './modules/interesting/coachings/interesting-coachings.module';
import { InterestingHelpsModule } from './modules/interesting/helps/interesting-helps.module';
import { InterestingImagesModule } from './modules/interesting/images/interesting-images.module';
import { InterestingMeditationsModule } from './modules/interesting/meditations/interesting-meditations.module';
import { LotusModule } from './modules/lotus/lotus.module';
import { MediaModule } from './modules/media/media.module';
import { MiscModule } from './modules/misc/misc.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';

export const mobileRoutes: Routes = [
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
    path: 'interesting/images',
    module: InterestingImagesModule,
  },
  {
    path: 'interesting/checklists',
    module: InterestingChecklistsModule,
  },
  {
    path: 'interesting/meditations',
    module: InterestingMeditationsModule,
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
    path: 'lotus',
    module: LotusModule,
  },
  {
    path: 'media',
    module: MediaModule,
  },
  {
    path: 'misc',
    module: MiscModule,
  },
  {
    path: 'subscriptions',
    module: SubscriptionsModule,
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
