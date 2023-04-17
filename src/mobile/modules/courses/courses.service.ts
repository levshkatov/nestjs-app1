import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../pop-up/pop-up.service';
import { CoursesMapper } from './courses.mapper';
import {
  CourseDetailedDto,
  CourseForListDto,
  CourseRemoveDto,
  CourseReqDto,
  CourseStartDto,
} from './dtos/course.dto';
import { PopUpDto } from '../pop-up/dtos/pop-up.dto';
import { CourseOrmService } from '../../../orm/modules/courses/course-orm.service';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { UserCourseOrmService } from '../../../orm/modules/users/courses/user-course-orm.service';
import { CourseScopesMap, ICourse } from '../../../orm/modules/courses/interfaces/course.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { CourseStepOrmService } from '../../../orm/modules/courses/steps/course-step-orm.service';
import { UserHabitOrmService } from '../../../orm/modules/users/habits/user-habit-orm.service';
import { UserLetterOrmService } from '../../../orm/modules/users/letters/user-letter-orm.service';
import { UserOrmService } from '../../../orm/modules/users/user-orm.service';
import { LetterTrigger } from '../../../orm/modules/letters/interfaces/letter-trigger.enum';
import { Op } from 'sequelize';
import { CourseType } from '../../../orm/modules/courses/interfaces/course-type.enum';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { omitNullProps } from '../../../shared/helpers/omit-null-props.helper';
import { UserCelebrityOrmService } from '../../../orm/modules/users/celebrities/user-celebrity-orm.service';

@Injectable()
export class CoursesService {
  constructor(
    private popup: PopUpService,
    private courses: CourseOrmService,
    private coursesMapper: CoursesMapper,
    private userCourses: UserCourseOrmService,
    private userHabits: UserHabitOrmService,
    private userLetters: UserLetterOrmService,
    private courseSteps: CourseStepOrmService,
    private users: UserOrmService,
    private userCelebrities: UserCelebrityOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    { type }: CourseReqDto,
    user?: IJWTUser,
  ): Promise<CourseForListDto[]> {
    const userCourses = user
      ? await this.userCourses.getAll({ where: { userId: user.userId } })
      : [];

    const courses = await this.courses.getAll(
      {
        where: { type },
        order: [
          ['index', 'ASC'],
          ['id', 'ASC'],
        ],
      },
      ['i18n', 'photo', 'photoInactive'],
    );

    return courses.map((course) => {
      const userCourse = userCourses.find(({ courseId }) => courseId === course.id);
      return this.coursesMapper.toCourseForListDto(i18n, course, {
        isAdded: userCourse?.courseId === course.id ? !userCourse.isCompleted : undefined,
        isCompleted: userCourse?.courseId === course.id ? userCourse.isCompleted : undefined,
      });
    });
  }

  async getOne(
    i18n: I18nContext,
    { id, tag }: { id?: number; tag?: string },
    user?: IJWTUser,
  ): Promise<CourseDetailedDto> {
    if (!id && !tag) {
      throw this.popup.error(i18n, `courses.notFound`);
    }

    const course = await this.courses.getOneFromAll({ where: omitNullProps({ id, tag }) }, [
      'i18n',
      'photo',
      'courseHabits',
    ]);
    if (!course) {
      throw this.popup.error(i18n, `courses.notFound`);
    }
    if (course.disabled) {
      throw this.popup.error(i18n, `courses.disabled`);
    }

    const userCourse = user
      ? await this.userCourses.getOne({ where: { userId: user.userId, courseId: course.id } })
      : null;

    return this.coursesMapper.toCourseDetailedDto(i18n, course, {
      isAdded: userCourse ? !userCourse.isCompleted : undefined,
      isCompleted: userCourse ? userCourse.isCompleted : undefined,
    });
  }

  async start(
    i18n: I18nContext,
    courseId: number,
    { forceChangeCourse }: CourseStartDto,
    { userId }: IJWTUser,
  ): Promise<PopUpDto> {
    const { type, courseHabits } = await this.getCourse(i18n, courseId);

    if (!!(await this.userCelebrities.getOne({ where: { userId } })) && !forceChangeCourse) {
      throw this.popup.question(i18n, `courses.activeCelebrity`);
    }

    const user = await this.users.getOneFromAll({ where: { id: userId } }, ['letters']);
    if (!user) {
      throw this.popup.error(i18n, `e.commonError`);
    }

    const courseStep = await this.courseSteps.getOneFromAll({ where: { courseId, index: 1 } }, [
      'courseStepExercises',
      'courseStepLetters',
    ]);
    if (!courseStep) {
      throw this.popup.error(i18n, `courses.notFound`);
    }

    const courseStepExercise = courseStep.courseStepExercises.find(({ index }) => index === 1);
    if (!courseStepExercise) {
      throw this.popup.error(i18n, `courses.notFound`);
    }

    const userCourses = await this.userCourses.getAll({ where: { userId } });
    const userCourse = userCourses.find(({ courseId: id }) => id === courseId);

    if (userCourse) {
      throw this.popup.error(
        i18n,
        `courses.${userCourse.isCompleted ? 'yetCompleted' : 'yetStarted'}`,
      );
    }

    const userCourseActive = userCourses.find(({ isCompleted }) => !isCompleted);

    if (userCourseActive && !forceChangeCourse) {
      throw this.popup.question(i18n, `courses.changeCourse`);
    }

    await this.userCelebrities.destroy({ where: { userId } });
    await this.userCourses.destroy({ where: { userId, isCompleted: false } });
    await this.userHabits.destroy({
      where: {
        userId,
        [Op.or]: {
          fromCourses: true,
          fromCelebrities: true,
          habitId: { [Op.in]: courseHabits.map(({ habitId }) => habitId) },
        },
      },
    });

    const lettersToDestroy = user.letters
      .filter(({ trigger }) =>
        [LetterTrigger.stepStart, LetterTrigger.stepFinish].includes(trigger),
      )
      .map(({ id }) => id);
    await this.userLetters.destroy({ where: { letterId: { [Op.in]: lettersToDestroy } } });

    await this.userHabits.bulkCreate(
      courseHabits.map(({ habitId, habit: { time } }) => ({
        userId,
        habitId,
        time,
        isCompleted: false,
        isChallenge: false,
        daysRemaining: 0,
        fromCourses: true,
        fromCelebrities: false,
      })),
      { ignoreDuplicates: true },
    );

    const letters = courseStep.courseStepLetters.filter(
      ({ letter: { trigger } }) => trigger === LetterTrigger.stepStart,
    );
    if (letters.length) {
      await this.userLetters.bulkCreate(
        letters.map(({ letterId }) => ({
          userId,
          letterId,
        })),
      );
    }

    await this.userCourses.create({
      userId,
      courseId,
      isCompleted: false,
      courseStepId: courseStep.id,
      courseStepExerciseId: courseStepExercise.exerciseId,
      exercisesCompletedToday: 0,
    });

    throw this.popup.ok(
      i18n,
      `courses.${type === CourseType.category ? 'addedCategory' : 'addedMountain'}`,
    );
  }

  async remove(
    i18n: I18nContext,
    courseId: number,
    { forceRemoveCourse }: CourseRemoveDto,
    { userId }: IJWTUser,
  ): Promise<PopUpDto> {
    const {} = await this.getCourse(i18n, courseId);

    const user = await this.users.getOneFromAll({ where: { id: userId } }, ['letters']);
    if (!user) {
      throw this.popup.error(i18n, `e.commonError`);
    }

    const userCourse = await this.userCourses.getOne({ where: { userId, isCompleted: false } });

    if (!userCourse) {
      throw this.popup.error(i18n, `courses.notFound`);
    }

    if (!forceRemoveCourse) {
      throw this.popup.question(i18n, `courses.removeCourse`);
    }

    await this.userCourses.destroy({ where: { userId, isCompleted: false } });
    await this.userHabits.destroy({ where: { userId, fromCourses: true } });

    const lettersToDestroy = user.letters
      .filter(({ trigger }) =>
        [LetterTrigger.stepStart, LetterTrigger.stepFinish].includes(trigger),
      )
      .map(({ id }) => id);
    await this.userLetters.destroy({ where: { letterId: { [Op.in]: lettersToDestroy } } });

    throw this.popup.ok(i18n, `courses.removed`);
  }

  async getCourse(
    i18n: I18nContext,
    id: number,
  ): Promise<BS<ICourse, CourseScopesMap, 'courseHabits'>> {
    if (!id) {
      throw this.popup.error(i18n, `courses.notFound`);
    }

    const course = await this.courses.getOneFromAll({ where: { id } }, ['courseHabits']);
    if (!course) {
      throw this.popup.error(i18n, `courses.notFound`);
    }
    if (course.disabled) {
      throw this.popup.error(i18n, `courses.disabled`);
    }

    return course;
  }
}
