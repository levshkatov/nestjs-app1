import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Attributes,
  BulkCreateOptions,
  CreationAttributes,
  DestroyOptions,
  Op,
  Sequelize,
  WhereOptions,
} from 'sequelize';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { whereColILike } from '../../shared/helpers/where-col-like.helper';
import { BS } from '../../shared/interfaces/scopes.interface';
import { PaginatedList } from '../interfaces/paginated-list.interface';
import { MainOrmService } from '../main-orm.service';
import { ITaskCategory } from './categories/interfaces/task-category.interface';
import { TaskOrmGetAllAdmin } from './interfaces/task-orm.interface';
import { ITask, TaskScopesMap } from './interfaces/task.interface';
import { TaskI18n } from './task-i18n.model';
import { Task } from './task.model';

@Injectable()
export class TaskOrmService extends MainOrmService<Task, TaskScopesMap> {
  constructor(
    @InjectModel(Task)
    private task: typeof Task,

    @InjectModel(TaskI18n)
    private taskI18n: typeof TaskI18n,
  ) {
    super(task);
    logClassName(this.constructor.name, __filename);
  }

  async getAllAdmin(
    { offset, limit }: Pagination,
    { forExercises, forHabits, id, name, categoryName, notLinked }: TaskOrmGetAllAdmin,
  ): Promise<
    PaginatedList<
      'tasks',
      BS<
        ITask,
        TaskScopesMap,
        | 'habits'
        | 'exerciseTasks'
        | 'interestingArticles'
        | 'interestingChecklists'
        | 'categorySearch'
      >
    >
  > {
    const whereOptions: WhereOptions<ITask> = [];
    const categoryWhereOptions: WhereOptions<ITaskCategory> = [];

    if (categoryName) {
      whereOptions.push({ categoryName });
    }
    if (id !== undefined) {
      whereOptions.push(whereColILike({ table: 'Task', col: 'id' }, id, 'text'));
    }
    if (name) {
      whereOptions.push(whereColILike({ table: 'Task', col: 'name' }, name));
    }
    if (forExercises !== undefined) {
      categoryWhereOptions.push({ forExercises });
    }
    if (forHabits !== undefined) {
      categoryWhereOptions.push({ forHabits });
    }
    if (notLinked) {
      whereOptions.push(Sequelize.where(Sequelize.col(`"habits"."taskId"`), Op.is, null));
      whereOptions.push(Sequelize.where(Sequelize.col(`"exerciseTasks"."taskId"`), Op.is, null));
      whereOptions.push(
        Sequelize.where(Sequelize.col(`"interestingArticles"."taskId"`), Op.is, null),
      );
      whereOptions.push(
        Sequelize.where(Sequelize.col(`"interestingChecklists"."taskId"`), Op.is, null),
      );
    }

    const {
      pages,
      total,
      rows: tasks,
    } = await this.getAllAndCount<
      | 'categorySearch'
      | 'habits'
      | 'exerciseTasks'
      | 'interestingArticles'
      | 'interestingChecklists'
    >(
      {
        where: {
          [Op.and]: whereOptions,
        },
        offset,
        limit,
        order: [['id', 'DESC']],
      },
      [
        { method: ['categorySearch', categoryWhereOptions] },
        { method: ['habits', notLinked] },
        { method: ['exerciseTasks', notLinked] },
        { method: ['interestingArticles', notLinked] },
        { method: ['interestingChecklists', notLinked] },
      ],
      '"Task"."id"',
    );

    return { pages, total, tasks };
  }

  async getOneAdmin(id: number) {
    return this.getOneFromAll(
      {
        where: { id },
      },
      [
        'i18n',
        'category',
        'habits',
        'exerciseTasks',
        'interestingArticles',
        'interestingChecklists',
      ],
    );
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<TaskI18n>>,
    options?: BulkCreateOptions<Attributes<TaskI18n>>,
  ): Promise<Attributes<TaskI18n>[]> {
    return MainOrmService.bulkCreate(this.taskI18n, records, options);
  }

  async destroyI18n(options?: DestroyOptions<Attributes<TaskI18n>>): Promise<number> {
    return MainOrmService.destroy(this.taskI18n, options);
  }
}
