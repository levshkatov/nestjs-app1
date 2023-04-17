import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../../pop-up/pop-up.service';
import { UserCourseStepsDto } from './dtos/user-course-steps.dto';
import { UserCourseDto } from './dtos/user-course-structure.dto';
import { UserCoursesMapper } from './user-courses.mapper';
import { UserCourseSimpleDto } from './dtos/user-course.dto';
import { TaskFinishDto } from '../../../shared/dtos/task-finish.dto';
import { TaskFinishScreen } from '../../../shared/interfaces/task-finish-screen.enum';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { IUserCourse } from '../../../../orm/modules/users/courses/interfaces/user-course.interface';
import { UserCourseOrmService } from '../../../../orm/modules/users/courses/user-course-orm.service';
import { CourseOrmService } from '../../../../orm/modules/courses/course-orm.service';
import { CourseStepOrmService } from '../../../../orm/modules/courses/steps/course-step-orm.service';
import { UserOrmService } from '../../../../orm/modules/users/user-orm.service';
import {
  UserCourseExerciseFullDto,
  UserCourseExercisesDto,
} from './dtos/user-course-exercises.dto';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { UserProfileOrmService } from '../../../../orm/modules/users/profiles/user-profile-orm.service';
import { LetterTrigger } from '../../../../orm/modules/letters/interfaces/letter-trigger.enum';
import { UserLetterOrmService } from '../../../../orm/modules/users/letters/user-letter-orm.service';
import { Op } from 'sequelize';
import { UserHabitOrmService } from '../../../../orm/modules/users/habits/user-habit-orm.service';
import {
  CourseStepLetterScopesMap,
  ICourseStepLetter,
} from '../../../../orm/modules/courses/steps/interfaces/course-step-letter.interface';
import { courseOrders } from '../../../../orm/modules/courses/scopes/course.scopes';
import { courseStepOrders } from '../../../../orm/modules/courses/steps/scopes/course-step.scopes';
import { MediaMapper } from '../../media/media.mapper';
import { LEVEL_DURATION } from '../../levels/interfaces/level.constants';
import { LevelsService } from '../../levels/levels.service';
import { TreesService } from '../../trees/trees.service';
import {
  ICourseStepExercise,
  CourseStepExerciseScopesMap,
} from '../../../../orm/modules/courses/steps/exercises/interfaces/course-step-exercise.interface';
import { CourseStepExerciseOrmService } from '../../../../orm/modules/courses/steps/exercises/course-step-exercise-orm.service';
import { TREE_DURATION } from '../../trees/interfaces/tree.constants';
import { USER_COURSE_MAX_EXERCISES } from '../../../../orm/modules/users/courses/interfaces/user-course.constants';

type TStepExercise = BS<ICourseStepExercise, CourseStepExerciseScopesMap, 'exercise'>;
@Injectable()
export class UserCoursesService {
  constructor(
    private popup: PopUpService,
    private courses: CourseOrmService,
    private userCourses: UserCourseOrmService,
    private userCoursesMapper: UserCoursesMapper,
    private steps: CourseStepOrmService,
    private userLetters: UserLetterOrmService,
    private users: UserOrmService,
    private profiles: UserProfileOrmService,
    private userHabits: UserHabitOrmService,
    private trees: TreesService,
    private levels: LevelsService,
    private mediaMapper: MediaMapper,
    private stepExercises: CourseStepExerciseOrmService,
  ) {}

  async getStructure(i18n: I18nContext, { userId }: IJWTUser): Promise<UserCourseDto> {
    const userCourse = await this.getActiveCourse(i18n, userId);

    const course = await this.courses.getOneFromAll(
      {
        where: { id: userCourse.courseId },
        order: [courseOrders.steps, courseOrders.stepExercises, courseOrders.stepExerciseTasks],
      },
      ['steps'],
    );
    if (!course) {
      throw this.popup.error(i18n, `courses.notFound`);
    }

    return this.userCoursesMapper.toUserCourseDto(i18n, course, userCourse);
  }

  async getSimple(i18n: I18nContext, { userId }: IJWTUser): Promise<UserCourseSimpleDto> {
    const { courseId, courseStepId } = await this.getActiveCourse(i18n, userId);

    const course = await this.courses.getOneFromAll({ where: { id: courseId } }, ['i18n']);

    const step = await this.steps.getOne({ where: { id: courseStepId } }, ['photo']);
    if (!course || !step) {
      throw this.popup.error(i18n, `courses.notFound`);
    }

    return this.userCoursesMapper.toUserCourseSimpleDto(i18n, course, step.photo);
  }

  async getExercises(i18n: I18nContext, { userId }: IJWTUser): Promise<UserCourseExercisesDto> {
    const userCourse = await this.getActiveCourse(i18n, userId);

    const [exercises, currentExercise] = await this.getStepExercises(i18n, userCourse);

    return this.userCoursesMapper.toUserCourseExercisesDto(
      i18n,
      exercises,
      userCourse.courseStepExerciseId,
      currentExercise.index,
    );
  }

  async startExercise(
    i18n: I18nContext,
    exerciseId: number,
    { userId }: IJWTUser,
  ): Promise<UserCourseExerciseFullDto> {
    const userCourse = await this.getActiveCourse(i18n, userId);

    // TODO uncomment for prod
    if (userCourse.exercisesCompletedToday >= USER_COURSE_MAX_EXERCISES) {
      throw this.popup.error(i18n, `courses.exerciseYetCompleted`);
    }

    const [exercises, currentExercise] = await this.getStepExercises(i18n, userCourse, exerciseId);

    return this.userCoursesMapper.toUserCourseExerciseFullDto(i18n, currentExercise);
  }

  async finishExercise(
    i18n: I18nContext,
    exerciseId: number,
    jwtUser: IJWTUser,
  ): Promise<TaskFinishDto> {
    const { userId } = jwtUser;
    const user = await this.users.getOneType({ where: { id: userId } }, 'mobile', [
      'letters',
      'profile',
    ]);
    if (!user) {
      throw this.popup.error(i18n, `e.commonError`);
    }
    const { totalTasks } = user.profile;

    const userCourse = await this.getActiveCourse(i18n, userId);
    const { courseId, courseStepId } = userCourse;

    // TODO uncomment for prod
    if (userCourse.exercisesCompletedToday >= USER_COURSE_MAX_EXERCISES) {
      throw this.popup.error(i18n, `courses.exerciseYetCompleted`);
    }

    const [exercises, currentExercise] = await this.getStepExercises(i18n, userCourse, exerciseId);

    const nextExercise = exercises.find(({ index }) => index === currentExercise.index + 1);
    if (nextExercise) {
      await this.userCourses.update(
        {
          courseStepExerciseId: nextExercise.exerciseId,
          exercisesCompletedToday: userCourse.exercisesCompletedToday + 1,
        },
        { where: { userId, courseId } },
      );
      return await this.updateTotalTasks(i18n, jwtUser, totalTasks, {});
    }

    const currentStep = (await this.steps.getOneFromAll({ where: { id: courseStepId } }, [
      'courseStepLetters',
    ]))!; // not null because in getStepExercises already checked

    await this.addLetters(
      userId,
      currentStep.courseStepLetters.filter(
        ({ letter: { trigger } }) => trigger === LetterTrigger.stepFinish,
      ),
    );

    const nextStep = await this.steps.getOneFromAll(
      { where: { courseId, index: currentStep.index + 1 } },
      ['courseStepLetters'],
    );

    if (nextStep) {
      const nextExercise = await this.stepExercises.getOne({
        where: { courseStepId: nextStep.id, index: 1 },
      });
      if (!nextExercise) {
        throw this.popup.error(i18n, `e.commonError`);
      }

      await this.addLetters(
        userId,
        nextStep.courseStepLetters.filter(
          ({ letter: { trigger } }) => trigger === LetterTrigger.stepStart,
        ),
      );

      await this.userCourses.update(
        {
          courseStepId: nextStep.id,
          courseStepExerciseId: nextExercise.exerciseId,
          exercisesCompletedToday: userCourse.exercisesCompletedToday + 1,
        },
        { where: { userId, courseId } },
      );

      return await this.updateTotalTasks(i18n, jwtUser, totalTasks, { courseStepId });
    }

    const lettersToDestroy = user.letters
      .filter(({ trigger }) =>
        [LetterTrigger.stepStart, LetterTrigger.stepFinish].includes(trigger),
      )
      .map(({ id }) => id);

    await this.userLetters.destroy({ where: { userId, letterId: { [Op.in]: lettersToDestroy } } });
    await this.userCourses.update(
      { isCompleted: true, exercisesCompletedToday: userCourse.exercisesCompletedToday + 1 },
      { where: { userId, courseId } },
    );
    await this.userHabits.destroy({ where: { userId, fromCourses: true } });

    return await this.updateTotalTasks(i18n, jwtUser, totalTasks, { courseId });
  }

  async getSteps(i18n: I18nContext, { userId }: IJWTUser): Promise<UserCourseStepsDto> {
    const { courseId, courseStepId } = await this.getActiveCourse(i18n, userId);

    const steps = await this.steps.getAll({ where: { courseId }, order: [['index', 'ASC']] });
    if (!steps.find(({ id }) => id === courseStepId)) {
      throw this.popup.error(i18n, `courses.noActiveCourse`);
    }

    const currentStep = await this.steps.getOne({ where: { id: courseStepId } }, ['photo']);

    return this.userCoursesMapper.toUserCourseStepsDto(
      i18n,
      steps,
      courseStepId,
      currentStep?.photo,
    );
  }

  async getActiveCourse(
    i18n: I18nContext,
    userId: number,
  ): Promise<RemoveNullReturnAll<IUserCourse, 'courseStepId' | 'courseStepExerciseId'>> {
    const userCourse = await this.userCourses.getOne({ where: { userId, isCompleted: false } });
    if (!userCourse?.courseStepId || !userCourse.courseStepExerciseId) {
      throw this.popup.error(i18n, `courses.noActiveCourse`);
    }
    return userCourse as RemoveNullReturnAll<IUserCourse, 'courseStepId' | 'courseStepExerciseId'>;
  }

  async getStepExercises(
    i18n: I18nContext,
    {
      courseStepId,
      courseStepExerciseId,
    }: RemoveNullReturnAll<IUserCourse, 'courseStepId' | 'courseStepExerciseId'>,
    exerciseId?: number,
  ): Promise<[TStepExercise[], TStepExercise]> {
    if (exerciseId && courseStepExerciseId !== exerciseId) {
      throw this.popup.error(i18n, `courses.onlyActiveTask`);
    }

    const step = await this.steps.getOneFromAll(
      {
        where: { id: courseStepId },
        order: [courseStepOrders.stepExercises, courseStepOrders.stepExerciseTasks],
      },
      ['courseStepExercises'],
    );
    if (!step) {
      throw this.popup.error(i18n, `courses.notFound`);
    }

    const currentExercise = step.courseStepExercises.find(
      ({ exerciseId }) => exerciseId === courseStepExerciseId,
    );
    if (!currentExercise) {
      throw this.popup.error(i18n, `courses.noActiveCourse`);
    }

    return [step.courseStepExercises, currentExercise];
  }

  async addLetters(
    userId: number,
    letters: BS<ICourseStepLetter, CourseStepLetterScopesMap, 'letter'>[],
  ) {
    if (letters.length) {
      await this.userLetters.bulkCreate(letters.map(({ letterId }) => ({ letterId, userId })));
    }
  }

  async updateTotalTasks(
    i18n: I18nContext,
    user: IJWTUser,
    totalTasks: number,
    { courseId, courseStepId }: { courseId?: number; courseStepId?: number }, // for courseFinished or courseStepFinished
  ): Promise<TaskFinishDto> {
    const oldLevelI = Math.floor(totalTasks / LEVEL_DURATION) + 1;
    totalTasks++;
    const newLevelI = Math.floor(totalTasks / LEVEL_DURATION) + 1;

    const newLevel = newLevelI !== oldLevelI ? await this.levels.get(i18n, totalTasks) : undefined;

    const screenType =
      totalTasks % TREE_DURATION === 0
        ? TaskFinishScreen.finish10thTask
        : TaskFinishScreen.finishCourseTask;

    const newTree =
      screenType === TaskFinishScreen.finish10thTask
        ? await this.trees.get(i18n, totalTasks)
        : undefined;

    let courseFinished = undefined;
    let courseStepFinished = undefined;
    if (courseId) {
      const course = await this.courses.getOneFromAll({ where: { id: courseId } }, ['photo']);
      if (course) {
        courseFinished = this.mediaMapper.toPhotoDto(i18n, course.photo);
      }
    } else if (courseStepId) {
      courseStepFinished = true;
    }

    await this.profiles.update({ totalTasks }, { where: { userId: user.userId } });

    return {
      screenType,
      newTree,
      newLevel,
      courseFinished,
      courseStepFinished,
    };
  }
}
