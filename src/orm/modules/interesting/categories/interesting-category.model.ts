import { Column, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IInterestingCategory } from './interfaces/interesting-category.interface';
import { InterestingCategoryI18n } from './interesting-category-i18n.model';
import { InterestingCategoryType } from './interfaces/interesting-category-type.enum';
import { interestingCategoryScopes } from './scopes/interesting-category.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';
import { InterestingChecklist } from '../checklists/interesting-checklist.model';
import { InterestingMeditation } from '../meditations/interesting-meditation.model';
import { InterestingCoaching } from '../coachings/interesting-coaching.model';

@Scopes(() => interestingCategoryScopes)
@Table({
  tableName: 'InterestingCategories',
})
export class InterestingCategory
  extends Model<IInterestingCategory, CreationAttributes<IInterestingCategory, 'id'>>
  implements IInterestingCategory
{
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
  type!: InterestingCategoryType;

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

  @HasMany(() => InterestingCategoryI18n, 'interestingCategoryId')
  i18n?: InterestingCategoryI18n[];

  @HasMany(() => InterestingChecklist, 'categoryId')
  checklists?: InterestingChecklist[];

  @HasMany(() => InterestingMeditation, 'categoryId')
  meditations?: InterestingMeditation[];

  @HasMany(() => InterestingCoaching, 'categoryId')
  coachings?: InterestingCoaching[];
}
