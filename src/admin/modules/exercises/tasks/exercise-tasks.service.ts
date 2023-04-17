import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ExerciseOrmService } from '../../../../orm/modules/exercises/exercise-orm.service';
import { ExerciseTaskOrmService } from '../../../../orm/modules/exercises/tasks/exercise-task-orm.service';
import { TaskOrmService } from '../../../../orm/modules/tasks/task-orm.service';
import { UserCourseOrmService } from '../../../../orm/modules/users/courses/user-course-orm.service';
import { OkDto } from '../../../../shared/dtos/responses.dto';
import { createDisclaimer } from '../../../../shared/helpers/create-disclaimer.helper';
import { createError, ErrorTitle } from '../../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { IndexObject, indexObjects } from '../../../shared/helpers/index-objects.helper';
import {
  ExercisesTasksForListDto,
  ExerciseTaskCreateReqDto,
  ExerciseTaskDetailedDto,
  ExerciseTaskEditReqDto,
} from './dtos/exercise-task.dto';
import { ExerciseTasksMapper } from './exercise-tasks.mapper';

@Injectable()
export class ExerciseTasksService {
  constructor(
    private i18n: I18nHelperService,
    private exercises: ExerciseOrmService,
    private tasks: TaskOrmService,
    private exerciseTasks: ExerciseTaskOrmService,
    private exerciseTasksMapper: ExerciseTasksMapper,
    private userCourses: UserCourseOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(i18n: I18nContext, exerciseId: number): Promise<ExercisesTasksForListDto> {
    const exerciseTasks = await this.exerciseTasks.getAll(
      {
        where: { exerciseId },
        order: [['index', 'ASC']],
      },
      ['task'],
    );

    const exerciseIsUsed = !!(await this.userCourses.getOne({
      where: { courseStepExerciseId: exerciseId, isCompleted: false },
    }));

    return {
      tasks: exerciseTasks.map((exerciseTask) =>
        this.exerciseTasksMapper.toExerciseTaskForListDto(i18n, exerciseTask),
      ),
      disclaimer: exerciseIsUsed ? createDisclaimer(i18n, 'exerciseTasks.isUsed') : undefined,
    };
  }

  async create(
    i18n: I18nContext,
    exerciseId: number,
    { index, taskId }: ExerciseTaskCreateReqDto,
  ): Promise<OkDto> {
    const exerciseTasks = await this.getExerciseTasks(i18n, 'create', exerciseId);

    await this.checkTask(i18n, 'create', taskId, exerciseTasks);

    const reindexed = indexObjects('create', { index, id: taskId }, exerciseTasks);
    if (!reindexed) {
      throw createError(i18n, 'create', 'exercises.wrongIndex');
    }

    const { toCreate, toUpdate, toDelete } = reindexed;

    if (toCreate.length !== 1 || !toCreate[0] || toDelete.length) {
      throw createError(i18n, 'create', 'exercises.wrongIndex');
    }
    await this.exerciseTasks.create({
      exerciseId,
      taskId: toCreate[0].id,
      index: toCreate[0].index,
    });

    if (toUpdate.length) {
      await this.exerciseTasks.bulkCreate(
        toUpdate.map(({ id, index }) => ({ taskId: id, exerciseId, index })),
        { updateOnDuplicate: ['index'] },
      );
    }

    return new OkDto();
  }

  async getOne(
    i18n: I18nContext,
    exerciseId: number,
    index: number,
  ): Promise<ExerciseTaskDetailedDto> {
    const exerciseTask = await this.exerciseTasks.getOneFromAll({ where: { exerciseId, index } }, [
      'task',
    ]);
    if (!exerciseTask) {
      throw createError(i18n, 'get', 'exercises.taskNotFound');
    }

    const exerciseIsUsed = !!(await this.userCourses.getOne({
      where: { courseStepExerciseId: exerciseId, isCompleted: false },
    }));

    return this.exerciseTasksMapper.toExerciseTaskDetailedDto(
      i18n,
      exerciseTask,
      exerciseIsUsed ? createDisclaimer(i18n, 'exerciseTasks.isUsed') : undefined,
    );
  }

  async edit(
    i18n: I18nContext,
    exerciseId: number,
    index: number,
    { index: newIndex, taskId }: ExerciseTaskEditReqDto,
  ): Promise<OkDto> {
    const exerciseTasks = await this.getExerciseTasks(i18n, 'edit', exerciseId);

    const exerciseTask = exerciseTasks.find((el) => el.index === index);
    if (!exerciseTask) {
      throw createError(i18n, 'edit', 'exercises.taskNotFound');
    }

    const exerciseIsUsed = !!(await this.userCourses.getOne({
      where: { courseStepExerciseId: exerciseId, isCompleted: false },
    }));
    if (exerciseIsUsed) {
      throw createError(i18n, 'edit', 'exercises.isUsed');
    }

    if (taskId === exerciseTask.id && newIndex === index) {
      return new OkDto();
    }

    if (taskId !== exerciseTask.id) {
      await this.checkTask(i18n, 'edit', taskId, exerciseTasks, index);
    }

    const reindexed = indexObjects('edit', { index: newIndex, id: taskId }, exerciseTasks, index);
    if (!reindexed) {
      throw createError(i18n, 'edit', 'exercises.wrongIndex');
    }

    const { toCreate, toUpdate, toDelete } = reindexed;

    if (toCreate.length || toDelete.length) {
      throw createError(i18n, 'edit', 'exercises.wrongIndex');
    }

    if (toUpdate.length) {
      await this.exerciseTasks.bulkCreate(
        toUpdate.map(({ id, index }) => ({ taskId: id, exerciseId, index })),
        { updateOnDuplicate: ['index'] },
      );
    }

    return new OkDto();
  }

  async delete(i18n: I18nContext, exerciseId: number, index: number): Promise<OkDto> {
    const exerciseTasks = await this.getExerciseTasks(i18n, 'delete', exerciseId);

    const exerciseTask = exerciseTasks.find((el) => el.index === index);
    if (!exerciseTask) {
      throw createError(i18n, 'delete', 'exercises.taskNotFound');
    }

    const exerciseIsUsed = !!(await this.userCourses.getOne({
      where: { courseStepExerciseId: exerciseId, isCompleted: false },
    }));
    if (exerciseIsUsed) {
      throw createError(i18n, 'edit', 'exercises.isUsed');
    }

    const reindexed = indexObjects('delete', exerciseTask, exerciseTasks);
    if (!reindexed) {
      throw createError(i18n, 'delete', 'exercises.wrongIndex');
    }

    const { toCreate, toUpdate, toDelete } = reindexed;

    if (toDelete.length !== 1 || !toDelete[0] || toCreate.length) {
      throw createError(i18n, 'delete', 'exercises.wrongIndex');
    }
    await this.exerciseTasks.destroy({
      where: { exerciseId, taskId: toDelete[0].id },
    });

    if (toUpdate.length) {
      await this.exerciseTasks.bulkCreate(
        toUpdate.map(({ id, index }) => ({ taskId: id, exerciseId, index })),
        { updateOnDuplicate: ['index'] },
      );
    }

    return new OkDto();
  }

  private async getExerciseTasks(
    i18n: I18nContext,
    errorTitle: ErrorTitle,
    exerciseId: number,
  ): Promise<IndexObject[]> {
    const exercise = await this.exercises.getOneFromAll({ where: { id: exerciseId } }, [
      'exerciseTasks',
    ]);
    if (!exercise) {
      throw createError(i18n, errorTitle, 'exercises.notFound');
    }

    return exercise.exerciseTasks.map(({ index, taskId }) => ({ index, id: taskId }));
  }

  private async checkTask(
    i18n: I18nContext,
    errorTitle: ErrorTitle,
    taskId: number,
    exerciseTasks: IndexObject[],
    index?: number,
  ): Promise<void> {
    const task = await this.tasks.getOneFromAll({ where: { id: taskId } }, ['category']);
    if (!task) {
      throw createError(i18n, errorTitle, 'tasks.notFound');
    }

    if (!task.category.forExercises) {
      throw createError(i18n, errorTitle, 'tasks.notForExercises');
    }

    const repeatTask = index
      ? exerciseTasks.find((task) => task.id === taskId && index !== task.index)
      : exerciseTasks.find((task) => task.id === taskId);

    if (repeatTask) {
      throw createError(i18n, errorTitle, 'exercises.noRepeatTasks');
    }
  }
}
