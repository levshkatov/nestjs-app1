import { BelongsTo, Column, ForeignKey, Model, Table, Scopes } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IExerciseTask } from './interfaces/exercise-task.interface';
import { Task } from '../../tasks/task.model';
import { Exercise } from '../exercise.model';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';
import { exerciseTaskScopes } from './scopes/exercise-task.scopes';

@Scopes(() => exerciseTaskScopes)
@Table({
  tableName: 'ExerciseTasks',
})
export class ExerciseTask
  extends Model<IExerciseTask, CreationAttributes<IExerciseTask>>
  implements IExerciseTask
{
  @ForeignKey(() => Exercise)
  @Column({
    primaryKey: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  exerciseId!: number;

  @ForeignKey(() => Task)
  @Column({
    primaryKey: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  taskId!: number;

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

  @BelongsTo(() => Task, 'taskId')
  task?: Task;

  @BelongsTo(() => Exercise, 'exerciseId')
  exercise?: Exercise;
}
