import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { Lang } from '../../../shared/interfaces/lang.enum';
import { Celebrity } from './celebrity.model';
import { ICelebrityI18n } from './interfaces/celebrity-i18n.interface';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';

@Table({
  tableName: 'CelebritiesI18n',
})
export class CelebrityI18n
  extends Model<ICelebrityI18n, CreationAttributes<ICelebrityI18n, 'id'>>
  implements ICelebrityI18n
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => Celebrity)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  celebrityId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  lang!: Lang;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  name!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  description!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  caption!: string;

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
