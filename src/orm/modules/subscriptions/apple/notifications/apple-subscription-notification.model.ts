import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IAppleSubscriptionNotification } from './interfaces/apple-subscription-notification.interface';
import { appleSubscriptionNotificationScopes } from './scopes/apple-subscription-notification.scopes';
import { CreationAttributes } from '../../../../shared/interfaces/attributes.interface';
import {
  AppStoreNotificationRenewalInfo,
  AppStoreNotificationTransactionInfo,
  Data,
} from './interfaces/app-store-connect-notifications';
import { AppleSubscription } from '../apple-subscription.model';

@Scopes(() => appleSubscriptionNotificationScopes)
@Table({
  tableName: 'AppleSubscriptionNotifications',
})
export class AppleSubscriptionNotification
  extends Model<
    IAppleSubscriptionNotification,
    CreationAttributes<IAppleSubscriptionNotification, 'id'>
  >
  implements IAppleSubscriptionNotification
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => AppleSubscription)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.TEXT,
  })
  originalTransactionId!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  notificationType!: string;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  subtype!: string | null;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  notificationUUID!: string;

  @Column({
    allowNull: true,
    type: DataTypes.JSON,
  })
  renewalInfo!: AppStoreNotificationRenewalInfo | null;

  @Column({
    allowNull: false,
    type: DataTypes.JSON,
  })
  transactionInfo!: AppStoreNotificationTransactionInfo;

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
