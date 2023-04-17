import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ILotus } from './interfaces/lotus.interface';
import { User } from '../users/user.model';
import { HabitDaypart } from '../habits/interfaces/habit-daypart.enum';
import { lotusScopes } from './scopes/lotus.scopes';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';

@Scopes(() => lotusScopes)
@Table({
  tableName: 'Lotus',
})
export class Lotus extends Model<ILotus, CreationAttributes<ILotus, 'id'>> implements ILotus {
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
    type: DataTypes.TEXT,
  })
  daypart!: HabitDaypart;

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
