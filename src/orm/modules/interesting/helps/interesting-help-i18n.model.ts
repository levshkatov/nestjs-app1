import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { Lang } from '../../../../shared/interfaces/lang.enum';
import { InterestingHelp } from './interesting-help.model';
import { IInterestingHelpI18n } from './interfaces/interesting-help-i18n.interface';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Table({
  tableName: 'InterestingHelpsI18n',
})
export class InterestingHelpI18n
  extends Model<IInterestingHelpI18n, CreationAttributes<IInterestingHelpI18n, 'id'>>
  implements IInterestingHelpI18n
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => InterestingHelp)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  interestingHelpId!: number;

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
    type: DataTypes.TEXT,
  })
  description!: string;

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
