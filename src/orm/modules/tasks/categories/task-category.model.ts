import { BelongsToMany, Column, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ITaskCategory } from './interfaces/task-category.interface';
import { TaskType } from '../types/task-type.model';
import { TaskCategoryType } from './task-category-type.model';
import { taskCategoryScopes } from './scopes/task-category.scopes';
import { TaskCategoryName } from './interfaces/task-category.enum';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => taskCategoryScopes)
@Table({
  tableName: 'TaskCategories',
})
export class TaskCategory
  extends Model<ITaskCategory, CreationAttributes<ITaskCategory>>
  implements ITaskCategory
{
  @Column({
    primaryKey: true,
    unique: true,
    type: DataTypes.TEXT,
  })
  name!: TaskCategoryName;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  forHabits!: boolean;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  forExercises!: boolean;

  @Column({
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
  })
  createdAt!: Date;

  @Column({
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
  })
  updatedAt!: Date;

  @BelongsToMany(() => TaskType, () => TaskCategoryType)
  taskTypes?: TaskType[];
}
