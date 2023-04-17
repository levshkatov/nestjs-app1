import { BelongsTo, Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ICourseStepExercise } from './interfaces/course-step-exercise.interface';
import { courseStepExerciseScopes } from './scopes/course-step-exercise.scopes';
import { CreationAttributes } from '../../../../shared/interfaces/attributes.interface';
import { CourseStep } from '../course-step.model';
import { Exercise } from '../../../exercises/exercise.model';

@Scopes(() => courseStepExerciseScopes)
@Table({
  tableName: 'CourseStepExercises',
})
export class CourseStepExercise
  extends Model<ICourseStepExercise, CreationAttributes<ICourseStepExercise>>
  implements ICourseStepExercise
{
  @ForeignKey(() => CourseStep)
  @Column({
    primaryKey: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  courseStepId!: number;

  @ForeignKey(() => Exercise)
  @Column({
    primaryKey: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  exerciseId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  index!: number;

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

  @BelongsTo(() => Exercise, 'exerciseId')
  exercise?: Exercise;

  @BelongsTo(() => CourseStep, 'courseStepId')
  courseStep?: CourseStep;
}
