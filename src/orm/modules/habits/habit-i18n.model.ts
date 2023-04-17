import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { Lang } from '../../../shared/interfaces/lang.enum';
import { Habit } from './habit.model';
import { IHabitI18n } from './interfaces/habit-i18n.interface';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';

@Table({
  tableName: 'HabitsI18n',
})
export class HabitI18n
  extends Model<IHabitI18n, CreationAttributes<IHabitI18n, 'id'>>
  implements IHabitI18n
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => Habit)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  habitId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  lang!: Lang;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  name!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  description!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  daypartDescription!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  goal!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  forWhom!: string;

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
