import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ILotusRecord } from './interfaces/lotus-record.interface';
import { User } from '../../users/user.model';
import { lotusRecordScopes } from './scopes/lotus-record.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => lotusRecordScopes)
@Table({
  tableName: 'LotusRecords',
})
export class LotusRecord
  extends Model<ILotusRecord, CreationAttributes<ILotusRecord, 'id'>>
  implements ILotusRecord
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  userId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  record!: number;

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
