import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IUserSession } from './interfaces/user-session.interface';
import { User } from '../user.model';
import { userSessionScopes } from './scopes/user-session.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => userSessionScopes)
@Table({
  tableName: 'UserSessions',
})
export class UserSession
  extends Model<IUserSession, CreationAttributes<IUserSession, 'id'>>
  implements IUserSession
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
    type: DataTypes.TEXT,
  })
  refreshTokenHash!: string;

  @Column({
    allowNull: false,
    type: DataTypes.DATE,
  })
  expireAt!: Date;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  fcmToken!: string | null;

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
