import { Module } from '@nestjs/common';
import { logClassName } from '../shared/helpers/log-classname.helper';
import { AdminMappersModule } from './modules/admin-mappers.module';
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

@Module({
  imports: [
    AdminMappersModule, // GLOBAL
    AuthModule,
    CelebritiesModule,
    CoursesModule,
    ExercisesModule,
    HabitsModule,
    InterestingArticlesModule,
    InterestingAudiosModule,
    InterestingCategoriesModule,
    InterestingChecklistsModule,
    InterestingCoachingsModule,
    InterestingHelpsModule,
    InterestingImagesModule,
    InterestingMeditationsModule,
    LettersModule,
    MediaModule,
    NotificationsModule,
    TasksModule,
    UsersModule,
  ],
})
export class AdminModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
