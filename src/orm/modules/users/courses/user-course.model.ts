import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IUserCourse } from './interfaces/user-course.interface';
import { CourseStep } from '../../courses/steps/course-step.model';
import { User } from '../user.model';
import { Course } from '../../courses/course.model';
import { userCourseScopes } from './scopes/user-course.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';
import { CourseStepExercise } from '../../courses/steps/exercises/course-step-exercise.model';

@Scopes(() => userCourseScopes)
@Table({
  tableName: 'UserCourses',
})
export class UserCourse
  extends Model<IUserCourse, CreationAttributes<IUserCourse>>
  implements IUserCourse
{
  @ForeignKey(() => User)
  @Column({
    primaryKey: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  userId!: number;

  @ForeignKey(() => Course)
  @Column({
    primaryKey: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  courseId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  isCompleted!: boolean;

  @ForeignKey(() => CourseStep)
  @Column({
    allowNull: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  courseStepId!: number | null;

  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  courseStepExerciseId!: number | null;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  exercisesCompletedToday!: number;

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
