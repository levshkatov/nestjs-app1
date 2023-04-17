import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { Lang } from '../../../../../shared/interfaces/lang.enum';
import { HabitCategoryBalance } from './habit-category-balance.model';
import { IHabitCategoryBalanceI18n } from './interfaces/habit-category-balance-i18n.interface';
import { CreationAttributes } from '../../../../shared/interfaces/attributes.interface';

@Table({
  tableName: 'HabitCategoryBalancesI18n',
})
export class HabitCategoryBalanceI18n
  extends Model<IHabitCategoryBalanceI18n, CreationAttributes<IHabitCategoryBalanceI18n, 'id'>>
  implements IHabitCategoryBalanceI18n
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => HabitCategoryBalance)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  habitCategoryBalanceId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  lang!: Lang;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  iconName!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  iconCaption!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  iconClosedCaption!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  iconNewCaption!: string;

  @Column({
    allowNull: false,
    type: DataTypes.ARRAY(DataTypes.TEXT),
  })
  balanceCaptions!: string[];

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
