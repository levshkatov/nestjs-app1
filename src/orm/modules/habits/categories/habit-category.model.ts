import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IHabitCategory } from './interfaces/habit-category.interface';
import { HabitCategoryI18n } from './habit-category-i18n.model';
import { Media } from '../../media/media.model';
import { habitCategoryScopes } from './scopes/habit-category.scopes';
import { HabitCategoryBalance } from './balances/habit-category-balance.model';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';
import { Habit } from '../habit.model';

@Scopes(() => habitCategoryScopes)
@Table({
  tableName: 'HabitCategories',
})
export class HabitCategory
  extends Model<IHabitCategory, CreationAttributes<IHabitCategory, 'id'>>
  implements IHabitCategory
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => Media)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  photoId!: number;

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

  @HasMany(() => HabitCategoryI18n, 'habitCategoryId')
  i18n?: HabitCategoryI18n[];

  @BelongsTo(() => Media, 'photoId')
  photo?: Media;

  @HasOne(() => HabitCategoryBalance, 'habitCategoryId')
  balance?: HabitCategoryBalance;

  @HasMany(() => Habit, 'categoryId')
  habits?: Habit[];
}
