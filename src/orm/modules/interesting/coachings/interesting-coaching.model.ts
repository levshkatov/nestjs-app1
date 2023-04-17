import { BelongsTo, Column, ForeignKey, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IInterestingCoaching } from './interfaces/interesting-coaching.interface';
import { InterestingCategory } from '../categories/interesting-category.model';
import { Media } from '../../media/media.model';
import { interestingCoachingScopes } from './scopes/interesting-coaching.scopes';
import { Exercise } from '../../exercises/exercise.model';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => interestingCoachingScopes)
@Table({
  tableName: 'InterestingCoachings',
})
export class InterestingCoaching
  extends Model<IInterestingCoaching, CreationAttributes<IInterestingCoaching, 'id'>>
  implements IInterestingCoaching
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
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  categoryId!: number;

  @ForeignKey(() => Media)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  photoId!: number;

  @ForeignKey(() => Exercise)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  exerciseId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  disabled!: boolean;

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

  @BelongsTo(() => Media, 'photoId')
  photo?: Media;

  @BelongsTo(() => Exercise, 'exerciseId')
  exercise?: Exercise;

  @BelongsTo(() => InterestingCategory, 'categoryId')
  category?: InterestingCategory;
}
