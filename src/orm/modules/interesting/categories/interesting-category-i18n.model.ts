import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { Lang } from '../../../../shared/interfaces/lang.enum';
import { InterestingCategory } from './interesting-category.model';
import { IInterestingCategoryI18n } from './interfaces/interesting-category-i18n.interface';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Table({
  tableName: 'InterestingCategoriesI18n',
})
export class InterestingCategoryI18n
  extends Model<IInterestingCategoryI18n, CreationAttributes<IInterestingCategoryI18n, 'id'>>
  implements IInterestingCategoryI18n
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => InterestingCategory)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  interestingCategoryId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  lang!: Lang;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  title!: string;

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
