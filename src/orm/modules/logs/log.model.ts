import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ILog } from './interfaces/log.interface';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';
@Table({
  tableName: 'Logs',
})
export class Log extends Model<ILog, CreationAttributes<ILog, 'id'>> implements ILog {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @Column({
    allowNull: true,
    type: DataTypes.STRING,
  })
  ipAddr!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.STRING,
  })
  method!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  url!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  userId!: number | null;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  username!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  role!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  reqLength!: number | null;

  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  resLength!: number | null;

  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  resStatus!: number | null;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  resStatusMessage!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  resTime!: number | null;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  reqType!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.JSONB,
  })
  reqBody!: any | null;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  extra!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.ARRAY(DataTypes.TEXT),
  })
  errors!: string[] | null;

  @Column({
    allowNull: true,
    type: DataTypes.JSONB,
  })
  serverError!: any | null;

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
