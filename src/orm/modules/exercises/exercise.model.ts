import { Column, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IExercise } from './interfaces/exercise.interface';
import { ExerciseI18n } from './exercise-i18n.model';
import { ExerciseTask } from './tasks/exercise-task.model';
import { exerciseScopes } from './scopes/exercise.scopes';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';
import { InterestingCoaching } from '../interesting/coachings/interesting-coaching.model';
import { CourseStepExercise } from '../courses/steps/exercises/course-step-exercise.model';

@Scopes(() => exerciseScopes)
@Table({
  tableName: 'Exercises',
})
export class Exercise
  extends Model<IExercise, CreationAttributes<IExercise, 'id'>>
  implements IExercise
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

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

  @HasMany(() => ExerciseI18n, 'exerciseId')
  i18n?: ExerciseI18n[];

  @HasMany(() => ExerciseTask, 'exerciseId')
  exerciseTasks?: ExerciseTask[];

  @HasMany(() => CourseStepExercise, 'exerciseId')
  courseStepExercises?: CourseStepExercise[];

  @HasMany(() => InterestingCoaching, 'exerciseId')
  interestingCoachings?: InterestingCoaching[];
}
