import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IUserBalance } from './interfaces/user-balance.interface';
import { HabitCategoryBalance } from '../../habits/categories/balances/habit-category-balance.model';
import { User } from '../user.model';
import { userBalanceScopes } from './scopes/user-balance.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => userBalanceScopes)
@Table({
  tableName: 'UserBalances',
})
export class UserBalance
  extends Model<IUserBalance, CreationAttributes<IUserBalance>>
  implements IUserBalance
{
  @ForeignKey(() => User)
  @Column({
    primaryKey: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  userId!: number;

  @ForeignKey(() => HabitCategoryBalance)
  @Column({
    primaryKey: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  habitCategoryBalanceId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  total!: number;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  isCompleted!: boolean;

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
