import { BelongsTo, Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ICourseHabit } from './interfaces/course-habit.interface';
import { Course } from './course.model';
import { Habit } from '../habits/habit.model';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';
import { courseHabitScopes } from './scopes/course-habit.scopes';

@Scopes(() => courseHabitScopes)
@Table({
  tableName: 'CourseHabits',
})
export class CourseHabit
  extends Model<ICourseHabit, CreationAttributes<ICourseHabit>>
  implements ICourseHabit
{
  @ForeignKey(() => Course)
  @Column({
    primaryKey: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  courseId!: number;

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

  @BelongsTo(() => Course, 'courseId')
  course?: Course;
}
