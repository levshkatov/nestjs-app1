import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ITaskCategoryType } from './interfaces/task-category-type.interface';
import { TaskCategory } from './task-category.model';
import { TaskType } from '../types/task-type.model';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Table({
  tableName: 'TaskCategoryTypes',
})
export class TaskCategoryType
  extends Model<ITaskCategoryType, CreationAttributes<ITaskCategoryType>>
  implements ITaskCategoryType
{
  @ForeignKey(() => TaskCategory)
  @Column({
    primaryKey: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.TEXT,
  })
  taskCategoryName!: string;

  @ForeignKey(() => TaskType)
  @Column({
    primaryKey: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.TEXT,
  })
  taskTypeName!: string;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  required!: boolean;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  maxElements!: number;

  @Column({
    allowNull: true,
    type: DataTypes.ARRAY(DataTypes.TEXT),
  })
  taskTypesExcluded!: string[] | null;

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
}
