import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { CourseOrmService } from '../../../orm/modules/courses/course-orm.service';
import { OkDto } from '../../../shared/dtos/responses.dto';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import {
  CoursesForListDto,
  CourseCreateReqDto,
  CourseDetailedDto,
  CourseEditReqDto,
  CoursesReqDto,
} from './dtos/course.dto';
import { CoursesMapper } from './courses.mapper';
import { createError } from '../../../shared/helpers/create-error.helper';
import { UserCourseOrmService } from '../../../orm/modules/users/courses/user-course-orm.service';
import { MediaOrmService } from '../../../orm/modules/media/media-orm.service';
import { MediaType } from '../../../orm/modules/media/interfaces/media-type.enum';
import { CourseType } from '../../../orm/modules/courses/interfaces/course-type.enum';
import { HabitOrmService } from '../../../orm/modules/habits/habit-orm.service';
import { Op } from 'sequelize';
import { ICourse } from '../../../orm/modules/courses/interfaces/course.interface';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { areArraysEqual } from '../../../shared/helpers/are-arrays-equal.helper';
import { createDisclaimer } from '../../../shared/helpers/create-disclaimer.helper';
import { NotificationsService } from '../../../shared/modules/notifications/notifications.service';
import { NotificationType } from '../../../orm/modules/notifications/interfaces/notification-type.enum';

@Injectable()
export class CoursesService {
  constructor(
    private i18n: I18nHelperService,
    private courses: CourseOrmService,
    private coursesMapper: CoursesMapper,
    private userCourses: UserCourseOrmService,
    private media: MediaOrmService,
    private habits: HabitOrmService,
    private notifications: NotificationsService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    pagination: Pagination,
    dto: CoursesReqDto,
  ): Promise<CoursesForListDto> {
    const { pages, total, courses } = await this.courses.getAllAdmin(pagination, dto);

    return {
      pages,
      total,
      courses: courses.map((course) => this.coursesMapper.toCourseForListDto(i18n, course)),
      disclaimer: createDisclaimer(i18n, 'courses.forbiddenIfUsed'),
    };
  }

  async create(
    i18n: I18nContext,
    { habitsIds, photoId, photoInactiveId, type, translations, index, tag }: CourseCreateReqDto,
  ): Promise<OkDto> {
    this.i18n.checkFallbackLang(i18n, translations);

    if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
      throw createError(i18n, 'create', 'media.photoNotFound');
    }

    if (type === CourseType.mountain) {
      if (
        photoInactiveId &&
        !(await this.media.getOne({ where: { id: photoInactiveId, type: MediaType.photo } }))
      ) {
        throw createError(i18n, 'create', 'media.photoNotFound');
      }
      photoInactiveId = photoInactiveId || photoId;
    }

    if (habitsIds.length) {
      if (new Set(habitsIds).size !== habitsIds.length) {
        throw createError(i18n, 'create', 'courses.wrongHabits');
      }

      const habits = await this.habits.getAll({
        where: { id: { [Op.in]: habitsIds }, disabled: false },
      });
      if (!habits.length || habits.length !== habitsIds.length) {
        throw createError(i18n, 'create', 'courses.wrongHabits');
      }
    }

    if (tag) {
      if (!!(await this.courses.getOne({ where: { tag } }))) {
        throw createError(i18n, 'create', 'courses.tagExisting');
      }
    }

    const course = await this.courses.create({
      disabled: true,
      type,
      photoId,
      photoInactiveId: type === CourseType.mountain ? photoInactiveId : null,
      index,
      tag,
    });

    await this.courses.createI18n(
      this.i18n.createTranslations(translations, { courseId: course.id }),
    );

    await this.courses.createHabits(habitsIds.map((habitId) => ({ courseId: course.id, habitId })));

    return new OkDto();
  }

  async getOne(i18n: I18nContext, id: number): Promise<CourseDetailedDto> {
    const course = await this.courses.getOneFromAll({ where: { id } }, [
      'i18n',
      'photo',
      'photoInactive',
      'courseHabits',
    ]);
    if (!course) {
      throw createError(i18n, 'get', 'courses.notFound');
    }

    const courseIsUsed = !!(await this.userCourses.getOne({
      where: { courseId: id, isCompleted: false },
    }));

    return this.coursesMapper.toCourseDetailedDto(
      i18n,
      course,
      courseIsUsed
        ? createDisclaimer(i18n, 'courses.isUsed', 'courses.forbiddenIfUsed')
        : undefined,
    );
  }

  async edit(
    i18n: I18nContext,
    id: number,
    {
      habitsIds,
      photoId,
      translations,
      type,
      disabled,
      photoInactiveId,
      index,
      tag,
    }: CourseEditReqDto,
    { role }: IJWTUser,
  ): Promise<OkDto> {
    const course = await this.courses.getOneFromAll({ where: { id } }, ['courseHabits']);
    if (!course) {
      throw createError(i18n, 'edit', 'courses.notFound');
    }

    if (type !== course.type) {
      throw createError(i18n, 'edit', 'courses.changeType');
    }

    const courseIsUsed = !!(await this.userCourses.getOne({
      where: { courseId: id, isCompleted: false },
    }));

    this.i18n.checkFallbackLang(i18n, translations);

    const courseUpdate: Partial<GetRequired<ICourse>> = {};

    if (photoId !== course.photoId) {
      if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
        throw createError(i18n, 'edit', 'media.photoNotFound');
      }
      courseUpdate.photoId = photoId;
    }

    if (type === CourseType.mountain && photoInactiveId !== course.photoInactiveId) {
      if (
        photoInactiveId &&
        !(await this.media.getOne({ where: { id: photoInactiveId, type: MediaType.photo } }))
      ) {
        throw createError(i18n, 'edit', 'media.photoNotFound');
      }
      photoInactiveId = photoInactiveId || photoId;
      courseUpdate.photoInactiveId = photoInactiveId;
    }

    if (disabled !== undefined && disabled !== course.disabled && role === UserRole.webAdmin) {
      if (disabled === true && courseIsUsed) {
        throw createError(i18n, 'edit', 'courses.courseHasUsers');
      }
      if (disabled === false && course.type === CourseType.category) {
        this.notifications.sendToAllUsers(NotificationType.newCourseCategory, id);
      }
      courseUpdate.disabled = disabled;
    }

    if (tag && tag !== course.tag) {
      if (!!(await this.courses.getOne({ where: { tag } }))) {
        throw createError(i18n, 'edit', 'courses.tagExisting');
      }
      courseUpdate.tag = tag;
    }

    if (index !== course.index) {
      courseUpdate.index = index;
    }

    // if course is used, we can't edit course habits
    if (courseIsUsed) {
      if (
        !areArraysEqual(
          habitsIds,
          course.courseHabits.map(({ habitId }) => habitId),
        )
      ) {
        throw createError(i18n, 'edit', 'courses.courseHasUsers');
      }
    }

    if (Object.keys(courseUpdate).length) {
      await this.courses.update(courseUpdate, { where: { id } });
    }

    if (!courseIsUsed) {
      await this.courses.destroyHabits({ where: { courseId: id } });
      await this.courses.createHabits(habitsIds.map((habitId) => ({ courseId: id, habitId })));
    }

    await this.courses.destroyI18n({ where: { courseId: id } });
    await this.courses.createI18n(this.i18n.createTranslations(translations, { courseId: id }));

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    const courseIsUsed = !!(await this.userCourses.getOne({
      where: { courseId: id, isCompleted: false },
    }));

    if (courseIsUsed) {
      throw createError(i18n, 'delete', 'courses.courseHasUsers');
    }

    if ((await this.courses.destroy({ where: { id } })) !== 1) {
      throw createError(i18n, 'delete', 'courses.notFound');
    }

    return new OkDto();
  }
}
