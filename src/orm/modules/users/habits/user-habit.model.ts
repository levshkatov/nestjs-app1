import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IUserHabit } from './interfaces/user-habit.interface';
import { User } from '../user.model';
import { Habit } from '../../habits/habit.model';
import { userHabitScopes } from './scopes/user-habit.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => userHabitScopes)
@Table({
  tableName: 'UserHabits',
})
export class UserHabit
  extends Model<IUserHabit, CreationAttributes<IUserHabit>>
  implements IUserHabit
{
  @ForeignKey(() => User)
  @Column({
    primaryKey: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  userId!: number;

  @ForeignKey(() => Habit)
  @Column({
    primaryKey: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  habitId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.TIME,
  })
  time!: string;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  isCompleted!: boolean;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  isChallenge!: boolean;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  daysRemaining!: number;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  fromCourses!: boolean;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  fromCelebrities!: boolean;

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
