import { BelongsTo, Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ICelebrityHabit } from './interfaces/celebrity-habit.interface';
import { Celebrity } from './celebrity.model';
import { Habit } from '../habits/habit.model';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';
import { celebrityHabitScopes } from './scopes/celebrity-habit.scopes';

@Scopes(() => celebrityHabitScopes)
@Table({
  tableName: 'CelebrityHabits',
})
export class CelebrityHabit
  extends Model<ICelebrityHabit, CreationAttributes<ICelebrityHabit>>
  implements ICelebrityHabit
{
  @ForeignKey(() => Celebrity)
  @Column({
    primaryKey: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  celebrityId!: number;

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

  @BelongsTo(() => Celebrity, 'celebrityId')
  celebrity?: Celebrity;
}
