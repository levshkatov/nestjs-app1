import { BelongsTo, Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IUserHabitData } from './interfaces/user-habit-data.interface';
import { User } from '../user.model';
import { Habit } from '../../habits/habit.model';
import { ITaskContent } from '../../tasks/interfaces/task-i18n.interface';
import { userHabitDataScopes } from './scopes/user-habit-data.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => userHabitDataScopes)
@Table({
  tableName: 'UserHabitDatas',
})
export class UserHabitData
  extends Model<IUserHabitData, CreationAttributes<IUserHabitData, 'id'>>
  implements IUserHabitData
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  userId!: number;

  @ForeignKey(() => Habit)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  habitId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.JSON,
  })
  content!: ITaskContent[];

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

  @BelongsTo(() => Habit, 'habitId')
  habit?: Habit;
}
