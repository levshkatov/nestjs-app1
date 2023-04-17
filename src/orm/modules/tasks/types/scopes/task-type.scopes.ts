import { OrderItem, Sequelize } from 'sequelize';
import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import { ITaskType, TaskTypeScopesMap } from '../interfaces/task-type.interface';
import { TaskType } from '../task-type.model';

export const taskTypeScopes: TScopes<ITaskType, TaskTypeScopesMap> = {
  include: () => ({
    include: {
      model: TaskType.unscoped(),
    },
  }),
};

export const taskTypeOrders: Record<'includeIndex' | 'includeName', OrderItem> = {
  includeIndex: [Sequelize.literal(`"include->TaskTypeInclude"."index"`), 'ASC'],
  includeName: [Sequelize.literal(`"include"."name"`), 'ASC'],
};
