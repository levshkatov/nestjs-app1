import { OrderItem, Sequelize } from 'sequelize';
import { setScope } from '../../../../shared/helpers/set-scope.helper';
import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import { TaskTypeScopesMap } from '../../types/interfaces/task-type.interface';
import { TaskType } from '../../types/task-type.model';
import { ITaskCategory, TaskCategoryScopesMap } from '../interfaces/task-category.interface';

export const taskCategoryScopes: TScopes<ITaskCategory, TaskCategoryScopesMap> = {
  taskTypes: () => ({
    include: {
      model: setScope<TaskType, keyof TaskTypeScopesMap>(TaskType, ['include']),
    },
  }),
};

export const taskCategoryOrders: Record<
  'taskTypesName' | 'taskTypesIncludeIndex' | 'taskTypesIncludeName',
  OrderItem
> = {
  taskTypesName: [Sequelize.literal(`"taskTypes"."name"`), 'ASC'],
  taskTypesIncludeIndex: [
    Sequelize.literal(`"taskTypes->include->TaskTypeInclude"."index"`),
    'ASC',
  ],
  taskTypesIncludeName: [Sequelize.literal(`"taskTypes->include"."name"`), 'ASC'],
};
