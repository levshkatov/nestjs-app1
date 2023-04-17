import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ITaskTypeInclude } from './interfaces/task-type-include.interface';
import { TaskType } from './task-type.model';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Table({
  tableName: 'TaskTypeIncludes',
})
export class TaskTypeInclude
  extends Model<ITaskTypeInclude, CreationAttributes<ITaskTypeInclude>>
  implements ITaskTypeInclude
{
  @ForeignKey(() => TaskType)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.TEXT,
  })
  taskTypeName!: string;

  @ForeignKey(() => TaskType)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.TEXT,
  })
  taskTypeIncludeName!: string;

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
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  index!: number;

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
