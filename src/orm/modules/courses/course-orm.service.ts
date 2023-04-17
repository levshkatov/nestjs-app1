import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../main-orm.service';
import { Course } from './course.model';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { CourseScopesMap, ICourse } from './interfaces/course.interface';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { CourseOrmGetAllAdmin } from './interfaces/course-orm.interface';
import { PaginatedList } from '../interfaces/paginated-list.interface';
import {
  Attributes,
  BulkCreateOptions,
  CreationAttributes,
  DestroyOptions,
  Op,
  WhereOptions,
} from 'sequelize';
import { ICourseI18n } from './interfaces/course-i18n.interface';
import { whereColILike } from '../../shared/helpers/where-col-like.helper';
import { BS } from '../../shared/interfaces/scopes.interface';
import { CourseI18n } from './course-i18n.model';
import { CourseHabit } from './course-habit.model';

@Injectable()
export class CourseOrmService extends MainOrmService<Course, CourseScopesMap> {
  constructor(
    @InjectModel(Course)
    private course: typeof Course,

    @InjectModel(CourseI18n)
    private courseI18n: typeof CourseI18n,

    @InjectModel(CourseHabit)
    private courseHabit: typeof CourseHabit,
  ) {
    super(course);
    logClassName(this.constructor.name, __filename);
  }

  async getAllAdmin(
    { offset, limit }: Pagination,
    { id, disabled, name, type }: CourseOrmGetAllAdmin,
  ): Promise<
    PaginatedList<'courses', BS<ICourse, CourseScopesMap, 'photo' | 'courseHabits' | 'i18nSearch'>>
  > {
    const whereOptions: WhereOptions<ICourse> = [];
    const i18nWhereOptions: WhereOptions<ICourseI18n> = [];

    if (id !== undefined) {
      whereOptions.push(whereColILike({ table: 'Course', col: 'id' }, id, 'text'));
    }
    if (type) {
      whereOptions.push({ type });
    }
    if (disabled !== undefined) {
      whereOptions.push({ disabled });
    }

    if (name) {
      i18nWhereOptions.push(whereColILike({ table: 'i18n', col: 'name' }, name));
    }

    const {
      pages,
      total,
      rows: courses,
    } = await this.getAllAndCount<'i18nSearch' | 'photo' | 'courseHabits'>(
      {
        where: {
          [Op.and]: whereOptions,
        },
        offset,
        limit,
        order: [['id', 'DESC']],
      },
      [
        { method: ['i18nSearch', i18nWhereOptions] },
        { method: 'photo' },
        { method: 'courseHabits' },
      ],
      '"Course"."id"',
    );

    return { pages, total, courses };
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<CourseI18n>>,
    options?: BulkCreateOptions<Attributes<CourseI18n>>,
  ): Promise<Attributes<CourseI18n>[]> {
    return MainOrmService.bulkCreate(this.courseI18n, records, options);
  }

  async destroyI18n(options?: DestroyOptions<Attributes<CourseI18n>>): Promise<number> {
    return MainOrmService.destroy(this.courseI18n, options);
  }

  async createHabits(
    records: ReadonlyArray<CreationAttributes<CourseHabit>>,
    options?: BulkCreateOptions<Attributes<CourseHabit>>,
  ): Promise<Attributes<CourseHabit>[]> {
    return MainOrmService.bulkCreate(this.courseHabit, records, options);
  }

  async destroyHabits(options?: DestroyOptions<Attributes<CourseHabit>>): Promise<number> {
    return MainOrmService.destroy(this.courseHabit, options);
  }
}
