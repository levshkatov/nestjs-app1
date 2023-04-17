import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { logClassName } from '../shared/helpers/log-classname.helper';
import { AuthModule } from './modules/auth/auth.module';
import { CelebritiesModule } from './modules/celebrities/celebrities.module';
import { CoursesModule } from './modules/courses/courses.module';
import { CronModule } from './modules/cron/cron.module';
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
import { MobileMappersModule } from './modules/mobile-mappers.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    MobileMappersModule, // GLOBAL
    AuthModule,
    CelebritiesModule,
    CoursesModule,
    ScheduleModule.forRoot(),
    CronModule,
    HabitsModule,
    InterestingArticlesModule,
    InterestingAudiosModule,
    InterestingImagesModule,
    InterestingChecklistsModule,
    InterestingMeditationsModule,
    InterestingCoachingsModule,
    InterestingHelpsModule,
    LotusModule,
    MediaModule,
    MiscModule,
    SubscriptionsModule,
    TasksModule,
    UsersModule,
  ],
})
export class MobileModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
