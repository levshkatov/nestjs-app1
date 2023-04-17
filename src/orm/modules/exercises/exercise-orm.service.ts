import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../main-orm.service';
import { Exercise } from './exercise.model';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { ExerciseScopesMap, IExercise } from './interfaces/exercise.interface';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { ExerciseOrmGetAllAdmin } from './interfaces/exercise-orm.interface';
import { PaginatedList } from '../interfaces/paginated-list.interface';
import { BS } from '../../shared/interfaces/scopes.interface';
import {
  Attributes,
  BulkCreateOptions,
  CreationAttributes,
  DestroyOptions,
  Op,
  WhereOptions,
} from 'sequelize';
import { IExerciseI18n } from './interfaces/exercise-i18n.interface';
import { whereColILike } from '../../shared/helpers/where-col-like.helper';
import { ExerciseTask } from './tasks/exercise-task.model';
import { ExerciseI18n } from './exercise-i18n.model';
import { IExerciseTask } from './tasks/interfaces/exercise-task.interface';

@Injectable()
export class ExerciseOrmService extends MainOrmService<Exercise, ExerciseScopesMap> {
  constructor(
    @InjectModel(Exercise)
    private exercise: typeof Exercise,

    @InjectModel(ExerciseI18n)
    private exerciseI18n: typeof ExerciseI18n,
  ) {
    super(exercise);
    logClassName(this.constructor.name, __filename);
  }

  async getAllAdmin(
    { offset, limit }: Pagination,
    { id, name, taskId }: ExerciseOrmGetAllAdmin,
  ): Promise<
    PaginatedList<
      'exercises',
      BS<
        IExercise,
        ExerciseScopesMap,
        'i18nSearch' | 'exerciseTasksSearch' | 'courseStepExercises' | 'interestingCoachings'
      >
    >
  > {
    const whereOptions: WhereOptions<IExercise> = [];
    const i18nWhereOptions: WhereOptions<IExerciseI18n> = [];
    const exerciseTaskWhereOptions: WhereOptions<IExerciseTask> = [];

    if (id !== undefined) {
      whereOptions.push(whereColILike({ table: 'Exercise', col: 'id' }, id, 'text'));
    }

    if (name) {
      i18nWhereOptions.push(whereColILike({ table: 'i18n', col: 'name' }, name));
    }

    if (taskId !== undefined) {
      exerciseTaskWhereOptions.push(
        whereColILike({ table: 'exerciseTasks', col: 'taskId' }, taskId, 'text'),
      );
    }

    const {
      pages,
      total,
      rows: exercises,
    } = await this.getAllAndCount<
      'i18nSearch' | 'exerciseTasksSearch' | 'courseStepExercises' | 'interestingCoachings'
    >(
      {
        where: {
          [Op.and]: whereOptions,
        },
        offset,
        limit,
        order: [
          ['id', 'DESC'],
          [{ model: ExerciseTask, as: 'exerciseTasks' }, 'index', 'ASC'],
        ],
      },
      [
        { method: ['i18nSearch', i18nWhereOptions] },
        { method: ['exerciseTasksSearch', exerciseTaskWhereOptions] },
        { method: 'courseStepExercises' },
        { method: 'interestingCoachings' },
      ],
      '"Exercise"."id"',
    );

    return { pages, total, exercises };
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<ExerciseI18n>>,
    options?: BulkCreateOptions<Attributes<ExerciseI18n>>,
  ): Promise<Attributes<ExerciseI18n>[]> {
    return MainOrmService.bulkCreate(this.exerciseI18n, records, options);
  }

  async destroyI18n(options?: DestroyOptions<Attributes<ExerciseI18n>>): Promise<number> {
    return MainOrmService.destroy(this.exerciseI18n, options);
  }
}
