import { BelongsTo, Column, ForeignKey, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ITask } from './interfaces/task.interface';
import { TaskI18n } from './task-i18n.model';
import { TaskCategory } from './categories/task-category.model';
import { taskScopes } from './scopes/task.scopes';
import { TaskCategoryName } from './categories/interfaces/task-category.enum';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';
import { Habit } from '../habits/habit.model';
import { ExerciseTask } from '../exercises/tasks/exercise-task.model';
import { InterestingArticle } from '../interesting/articles/interesting-article.model';
import { InterestingChecklist } from '../interesting/checklists/interesting-checklist.model';

@Scopes(() => taskScopes)
@Table({
  tableName: 'Tasks',
})
export class Task extends Model<ITask, CreationAttributes<ITask, 'id'>> implements ITask {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  name!: string;

  @ForeignKey(() => TaskCategory)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.TEXT,
  })
  categoryName!: TaskCategoryName;

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

  @HasMany(() => TaskI18n, 'taskId')
  i18n?: TaskI18n[];

  @BelongsTo(() => TaskCategory, 'categoryName')
  category?: TaskCategory;

  @HasMany(() => Habit, 'taskId')
  habits?: Habit[];

  @HasMany(() => ExerciseTask, 'taskId')
  exerciseTasks?: ExerciseTask[];

  @HasMany(() => InterestingArticle, 'taskId')
  interestingArticles?: InterestingArticle[];

  @HasMany(() => InterestingChecklist, 'taskId')
  interestingChecklists?: InterestingChecklist[];
}
