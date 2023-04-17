import { Column, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IString } from './interfaces/string.interface';
import { StringI18n } from './string-i18n.model';
import { stringScopes } from './scopes/string.scopes';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';

@Scopes(() => stringScopes)
@Table({
  tableName: 'Strings',
})
export class String extends Model<IString, CreationAttributes<IString>> implements IString {
  @Column({
    primaryKey: true,
    unique: true,
    type: DataTypes.TEXT,
  })
  name!: string;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  screenName!: string | null;

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

  @HasMany(() => StringI18n, 'stringName')
  i18n?: StringI18n[];
}
