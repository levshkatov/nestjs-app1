import { BelongsTo, Column, ForeignKey, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IHabit } from './interfaces/habit.interface';
import { HabitI18n } from './habit-i18n.model';
import { HabitCategory } from './categories/habit-category.model';
import { Task } from '../tasks/task.model';
import { HabitDaypart } from './interfaces/habit-daypart.enum';
import { habitScopes } from './scopes/habit.scopes';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';
import { CelebrityHabit } from '../celebrities/celebrity-habit.model';
import { CourseHabit } from '../courses/course-habit.model';

@Scopes(() => habitScopes)
@Table({
  tableName: 'Habits',
})
export class Habit extends Model<IHabit, CreationAttributes<IHabit, 'id'>> implements IHabit {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => HabitCategory)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  categoryId!: number;

  @ForeignKey(() => Task)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  taskId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  disabled!: boolean;

  @Column({
    allowNull: false,
    type: DataTypes.TIME,
  })
  time!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  daypart!: HabitDaypart;

  @Column({
    allowNull: true,
    type: DataTypes.TIME,
  })
  countdown!: string | null;

  @Column({
    allowNull: true,
    unique: true,
    type: DataTypes.TEXT,
  })
  tag!: string | null;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 1000,
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

  @HasMany(() => HabitI18n, 'habitId')
  i18n?: HabitI18n[];

  @BelongsTo(() => HabitCategory, 'categoryId')
  category?: HabitCategory;

  @BelongsTo(() => Task, 'taskId')
  task?: Task;

  @HasMany(() => CelebrityHabit, 'habitId')
  celebrityHabits?: CelebrityHabit[];

  @HasMany(() => CourseHabit, 'habitId')
  courseHabits?: CourseHabit[];
}
