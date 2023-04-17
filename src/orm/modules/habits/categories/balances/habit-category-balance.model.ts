import { BelongsTo, Column, ForeignKey, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IHabitCategoryBalance } from './interfaces/habit-category-balance.interface';
import { HabitCategoryBalanceI18n } from './habit-category-balance-i18n.model';
import { HabitCategory } from '../habit-category.model';
import { Media } from '../../../media/media.model';
import { habitCategoryBalanceScopes } from './scopes/habit-category-balance.scopes';
import { CreationAttributes } from '../../../../shared/interfaces/attributes.interface';

@Scopes(() => habitCategoryBalanceScopes)
@Table({
  tableName: 'HabitCategoryBalances',
})
export class HabitCategoryBalance
  extends Model<IHabitCategoryBalance, CreationAttributes<IHabitCategoryBalance>>
  implements IHabitCategoryBalance
{
  @ForeignKey(() => HabitCategory)
  @Column({
    primaryKey: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  habitCategoryId!: number;

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

  @HasMany(() => HabitCategoryBalanceI18n, 'habitCategoryBalanceId')
  i18n?: HabitCategoryBalanceI18n[];

  @BelongsTo(() => Media, 'photoId')
  photo?: Media;

  @BelongsTo(() => HabitCategory, 'habitCategoryId')
  habitCategory?: HabitCategory;
}
