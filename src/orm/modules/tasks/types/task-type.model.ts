import { BelongsToMany, Column, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ITaskType } from './interfaces/task-type.interface';
import { TaskTypeInclude } from './task-type-include.model';
import { taskTypeScopes } from './scopes/task-type.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => taskTypeScopes)
@Table({
  tableName: 'TaskTypes',
})
export class TaskType extends Model<ITaskType, CreationAttributes<ITaskType>> implements ITaskType {
  @Column({
    primaryKey: true,
    unique: true,
    type: DataTypes.TEXT,
  })
  name!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  description!: string;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  dataDescription!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  dataDefault!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.ARRAY(DataTypes.STRING),
  })
  files!: string[] | null;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  dataRequired!: boolean;

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

  @BelongsToMany(() => TaskType, {
    through: () => TaskTypeInclude,
    foreignKey: 'taskTypeName',
    otherKey: 'taskTypeIncludeName',
  })
  include?: TaskType[];
}
