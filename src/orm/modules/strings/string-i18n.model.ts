import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { Lang } from '../../../shared/interfaces/lang.enum';
import { String } from './string.model';
import { IStringI18n } from './interfaces/string-i18n.interface';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';

@Table({
  tableName: 'StringsI18n',
})
export class StringI18n
  extends Model<IStringI18n, CreationAttributes<IStringI18n, 'id'>>
  implements IStringI18n
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => String)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.TEXT,
  })
  stringName!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  lang!: Lang;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  text!: string;

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
