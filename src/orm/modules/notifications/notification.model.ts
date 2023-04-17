import { Column, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { INotification } from './interfaces/notification.interface';
import { NotificationI18n } from './notification-i18n.model';
import { notificationScopes } from './scopes/notification.scopes';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';
import { NotificationType } from './interfaces/notification-type.enum';

@Scopes(() => notificationScopes)
@Table({
  tableName: 'Notifications',
})
export class Notification
  extends Model<INotification, CreationAttributes<INotification, 'id'>>
  implements INotification
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  type!: NotificationType;

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

  @HasMany(() => NotificationI18n, 'notificationId')
  i18n?: NotificationI18n[];
}
