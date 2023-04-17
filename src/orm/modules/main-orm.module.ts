import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { logClassName } from '../../shared/helpers/log-classname.helper';
import { CelebrityHabit } from './celebrities/celebrity-habit.model';
import { CelebrityI18n } from './celebrities/celebrity-i18n.model';
import { CelebrityOrmService } from './celebrities/celebrity-orm.service';
import { Celebrity } from './celebrities/celebrity.model';
import { CourseHabit } from './courses/course-habit.model';
import { CourseI18n } from './courses/course-i18n.model';
import { CourseOrmService } from './courses/course-orm.service';
import { Course } from './courses/course.model';
import { CourseStepI18n } from './courses/steps/course-step-i18n.model';
import { CourseStepLetter } from './courses/steps/course-step-letter.model';
import { CourseStepOrmService } from './courses/steps/course-step-orm.service';
import { CourseStep } from './courses/steps/course-step.model';
import { ExerciseI18n } from './exercises/exercise-i18n.model';
import { ExerciseOrmService } from './exercises/exercise-orm.service';
import { ExerciseTask } from './exercises/tasks/exercise-task.model';
import { Exercise } from './exercises/exercise.model';
import { HabitCategoryBalanceI18n } from './habits/categories/balances/habit-category-balance-i18n.model';
import { HabitCategoryBalanceOrmService } from './habits/categories/balances/habit-category-balance-orm.service';
import { HabitCategoryBalance } from './habits/categories/balances/habit-category-balance.model';
import { HabitCategoryI18n } from './habits/categories/habit-category-i18n.model';
import { HabitCategoryOrmService } from './habits/categories/habit-category-orm.service';
import { HabitCategory } from './habits/categories/habit-category.model';
import { HabitI18n } from './habits/habit-i18n.model';
import { HabitOrmService } from './habits/habit-orm.service';
import { Habit } from './habits/habit.model';
import { InterestingArticleI18n } from './interesting/articles/interesting-article-i18n.model';
import { InterestingArticleOrmService } from './interesting/articles/interesting-article-orm.service';
import { InterestingArticle } from './interesting/articles/interesting-article.model';
import { InterestingAudioI18n } from './interesting/audios/interesting-audio-i18n.model';
import { InterestingAudioOrmService } from './interesting/audios/interesting-audio-orm.service';
import { InterestingAudio } from './interesting/audios/interesting-audio.model';
import { InterestingCategoryI18n } from './interesting/categories/interesting-category-i18n.model';
import { InterestingCategoryOrmService } from './interesting/categories/interesting-category-orm.service';
import { InterestingCategory } from './interesting/categories/interesting-category.model';
import { InterestingChecklistI18n } from './interesting/checklists/interesting-checklist-i18n.model';
import { InterestingChecklistOrmService } from './interesting/checklists/interesting-checklist-orm.service';
import { InterestingChecklist } from './interesting/checklists/interesting-checklist.model';
import { InterestingCoachingOrmService } from './interesting/coachings/interesting-coaching-orm.service';
import { InterestingCoaching } from './interesting/coachings/interesting-coaching.model';
import { InterestingHelpI18n } from './interesting/helps/interesting-help-i18n.model';
import { InterestingHelpOrmService } from './interesting/helps/interesting-help-orm.service';
import { InterestingHelp } from './interesting/helps/interesting-help.model';
import { InterestingImageOrmService } from './interesting/images/interesting-image-orm.service';
import { InterestingImage } from './interesting/images/interesting-image.model';
import { InterestingMeditationI18n } from './interesting/meditations/interesting-meditation-i18n.model';
import { InterestingMeditationOrmService } from './interesting/meditations/interesting-meditation-orm.service';
import { InterestingMeditation } from './interesting/meditations/interesting-meditation.model';
import { LetterI18n } from './letters/letter-i18n.model';
import { LetterOrmService } from './letters/letter-orm.service';
import { Letter } from './letters/letter.model';
import { LevelI18n } from './levels/level-i18n.model';
import { LevelOrmService } from './levels/level-orm.service';
import { Level } from './levels/level.model';
import { LogOrmService } from './logs/log-orm.service';
import { Log } from './logs/log.model';
import { LotusOrmService } from './lotuses/lotus-orm.service';
import { Lotus } from './lotuses/lotus.model';
import { LotusRecordOrmService } from './lotuses/records/lotus-record-orm.service';
import { LotusRecord } from './lotuses/records/lotus-record.model';
import { MediaOrmService } from './media/media-orm.service';
import { MediaPhotoSize } from './media/media-photo-size.model';
import { Media } from './media/media.model';
import { NotificationI18n } from './notifications/notification-i18n.model';
import { NotificationOrmService } from './notifications/notification-orm.service';
import { Notification } from './notifications/notification.model';
import { String } from './strings/string.model';
import { StringI18n } from './strings/string-i18n.model';
import { StringOrmService } from './strings/string-orm.service';
import { AppleSubscriptionOrmService } from './subscriptions/apple/apple-subscription-orm.service';
import { AppleSubscription } from './subscriptions/apple/apple-subscription.model';
import { AppleSubscriptionNotificationOrmService } from './subscriptions/apple/notifications/apple-subscription-notification-orm.service';
import { AppleSubscriptionNotification } from './subscriptions/apple/notifications/apple-subscription-notification.model';
import { TaskCategoryOrmService } from './tasks/categories/task-category-orm.service';
import { TaskCategoryType } from './tasks/categories/task-category-type.model';
import { TaskCategory } from './tasks/categories/task-category.model';
import { TaskI18n } from './tasks/task-i18n.model';
import { TaskOrmService } from './tasks/task-orm.service';
import { Task } from './tasks/task.model';
import { TaskTypeInclude } from './tasks/types/task-type-include.model';
import { TaskTypeOrmService } from './tasks/types/task-type-orm.service';
import { TaskType } from './tasks/types/task-type.model';
import { TreeI18n } from './trees/tree-i18n.model';
import { TreeOrmService } from './trees/tree-orm.service';
import { Tree } from './trees/tree.model';
import { UserClaimOrmService } from './users/claims/user-claim-orm.service';
import { UserClaim } from './users/claims/user-claim.model';
import { UserHabitDataOrmService } from './users/habit-datas/user-habit-data-orm.service';
import { UserHabitData } from './users/habit-datas/user-habit-data.model';
import { UserProfileOrmService } from './users/profiles/user-profile-orm.service';
import { UserProfile } from './users/profiles/user-profile.model';
import { UserSessionOrmService } from './users/sessions/user-session-orm.service';
import { UserSession } from './users/sessions/user-session.model';
import { UserSocialOrmService } from './users/socials/user-social-orm.service';
import { UserSocial } from './users/socials/user-social.model';
import { UserBalance } from './users/balances/user-balance.model';
import { UserCourse } from './users/courses/user-course.model';
import { UserHabit } from './users/habits/user-habit.model';
import { UserOrmService } from './users/user-orm.service';
import { User } from './users/user.model';
import { UserVerifyCodeOrmService } from './users/verify-codes/user-verify-code-orm.service';
import { UserVerifyCode } from './users/verify-codes/user-verify-code.model';
import { UserHabitOrmService } from './users/habits/user-habit-orm.service';
import { UserCourseOrmService } from './users/courses/user-course-orm.service';
import { UserBalanceOrmService } from './users/balances/user-balance-orm.service';
import { UserInterestingChecklistData } from './users/interesting-checklist-datas/user-interesting-checklist-data.model';
import { UserLetter } from './users/letters/user-letter.model';
import { UserLetterOrmService } from './users/letters/user-letter-orm.service';
import { UserInterestingChecklistDataOrmService } from './users/interesting-checklist-datas/user-interesting-checklist-data-orm.service';
import { ExerciseTaskOrmService } from './exercises/tasks/exercise-task-orm.service';
import { CourseStepExercise } from './courses/steps/exercises/course-step-exercise.model';
import { CourseStepExerciseOrmService } from './courses/steps/exercises/course-step-exercise-orm.service';
import { UserCelebrity } from './users/celebrities/user-celebrity.model';
import { UserCelebrityOrmService } from './users/celebrities/user-celebrity-orm.service';
import { UserNotification } from './users/notifications/user-notification.model';
import { UserNotificationOrmService } from './users/notifications/user-notification-orm.service';

const models = [
  Celebrity,
  CelebrityHabit,
  CelebrityI18n,
  Course,
  CourseHabit,
  CourseI18n,
  CourseStep,
  CourseStepExercise,
  CourseStepI18n,
  CourseStepLetter,
  Exercise,
  ExerciseI18n,
  ExerciseTask,
  Habit,
  HabitI18n,
  HabitCategory,
  HabitCategoryI18n,
  HabitCategoryBalance,
  HabitCategoryBalanceI18n,
  InterestingArticle,
  InterestingArticleI18n,
  InterestingAudio,
  InterestingAudioI18n,
  InterestingCategory,
  InterestingCategoryI18n,
  InterestingChecklist,
  InterestingChecklistI18n,
  InterestingCoaching,
  InterestingHelp,
  InterestingHelpI18n,
  InterestingImage,
  InterestingMeditation,
  InterestingMeditationI18n,
  Letter,
  LetterI18n,
  Level,
  LevelI18n,
  Log,
  Lotus,
  LotusRecord,
  Media,
  MediaPhotoSize,
  Notification,
  NotificationI18n,
  String,
  StringI18n,
  AppleSubscription,
  AppleSubscriptionNotification,
  Task,
  TaskI18n,
  TaskCategory,
  TaskCategoryType,
  TaskType,
  TaskTypeInclude,
  Tree,
  TreeI18n,
  User,
  UserCelebrity,
  UserBalance,
  UserCourse,
  UserHabit,
  UserInterestingChecklistData,
  UserLetter,
  UserClaim,
  UserHabitData,
  UserProfile,
  UserSession,
  UserSocial,
  UserVerifyCode,
  UserNotification,
];

const services = [
  CelebrityOrmService,
  CourseOrmService,
  CourseStepOrmService,
  CourseStepExerciseOrmService,
  ExerciseOrmService,
  ExerciseTaskOrmService,
  HabitOrmService,
  HabitCategoryOrmService,
  HabitCategoryBalanceOrmService,
  InterestingArticleOrmService,
  InterestingAudioOrmService,
  InterestingCategoryOrmService,
  InterestingChecklistOrmService,
  InterestingCoachingOrmService,
  InterestingHelpOrmService,
  InterestingImageOrmService,
  InterestingMeditationOrmService,
  LetterOrmService,
  LevelOrmService,
  LogOrmService,
  LotusOrmService,
  LotusRecordOrmService,
  MediaOrmService,
  NotificationOrmService,
  StringOrmService,
  AppleSubscriptionOrmService,
  AppleSubscriptionNotificationOrmService,
  TaskOrmService,
  TaskCategoryOrmService,
  TaskTypeOrmService,
  TreeOrmService,
  UserOrmService,
  UserCelebrityOrmService,
  UserBalanceOrmService,
  UserClaimOrmService,
  UserCourseOrmService,
  UserHabitOrmService,
  UserHabitDataOrmService,
  UserInterestingChecklistDataOrmService,
  UserLetterOrmService,
  UserProfileOrmService,
  UserSessionOrmService,
  UserSocialOrmService,
  UserVerifyCodeOrmService,
  UserNotificationOrmService,
];

@Global()
@Module({
  imports: [SequelizeModule.forFeature(models)],
  providers: services,
  exports: services,
})
export class MainOrmModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
