import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';
import { IUserNotification } from './interfaces/user-notification.interface';
import { userNotificationScopes } from './scopes/user-notification.scopes';
import { User } from '../user.model';
import { NotificationType } from '../../notifications/interfaces/notification-type.enum';
import { UserSession } from '../sessions/user-session.model';

@Scopes(() => userNotificationScopes)
@Table({
  tableName: 'UserNotifications',
})
export class UserNotification
  extends Model<IUserNotification, CreationAttributes<IUserNotification, 'id'>>
  implements IUserNotification
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

  @ForeignKey(() => UserSession)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  sessionId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  type!: NotificationType;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  messageString!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  messageId!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  error!: string | null;

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
