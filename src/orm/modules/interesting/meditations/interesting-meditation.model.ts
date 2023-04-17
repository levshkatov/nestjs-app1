import { BelongsTo, Column, ForeignKey, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IInterestingMeditation } from './interfaces/interesting-meditation.interface';
import { InterestingMeditationI18n } from './interesting-meditation-i18n.model';
import { InterestingCategory } from '../categories/interesting-category.model';
import { Media } from '../../media/media.model';
import { interestingMeditationScopes } from './scopes/interesting-meditation.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => interestingMeditationScopes)
@Table({
  tableName: 'InterestingMeditations',
})
export class InterestingMeditation
  extends Model<IInterestingMeditation, CreationAttributes<IInterestingMeditation, 'id'>>
  implements IInterestingMeditation
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

  @ForeignKey(() => Media)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  audioFemaleId!: number;

  @ForeignKey(() => Media)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  audioMaleId!: number;

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

  @HasMany(() => InterestingMeditationI18n, 'interestingMeditationId')
  i18n?: InterestingMeditationI18n[];

  @BelongsTo(() => Media, 'photoId')
  photo?: Media;

  @BelongsTo(() => Media, 'audioFemaleId')
  audioFemale?: Media;

  @BelongsTo(() => Media, 'audioMaleId')
  audioMale?: Media;

  @BelongsTo(() => InterestingCategory, 'categoryId')
  category?: InterestingCategory;
}
