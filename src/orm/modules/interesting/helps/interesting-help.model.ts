import { BelongsTo, Column, ForeignKey, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IInterestingHelp } from './interfaces/interesting-help.interface';
import { InterestingHelpI18n } from './interesting-help-i18n.model';
import { Media } from '../../media/media.model';
import { interestingHelpScopes } from './scopes/interesting-help.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => interestingHelpScopes)
@Table({
  tableName: 'InterestingHelps',
})
export class InterestingHelp
  extends Model<IInterestingHelp, CreationAttributes<IInterestingHelp, 'id'>>
  implements IInterestingHelp
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

  @ForeignKey(() => Media)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  audioId!: number;

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

  @HasMany(() => InterestingHelpI18n, 'interestingHelpId')
  i18n?: InterestingHelpI18n[];

  @BelongsTo(() => Media, 'photoId')
  photo?: Media;

  @BelongsTo(() => Media, 'audioId')
  audio?: Media;
}
