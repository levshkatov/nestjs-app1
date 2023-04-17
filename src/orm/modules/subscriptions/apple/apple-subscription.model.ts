import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IAppleSubscription } from './interfaces/apple-subscription.interface';
import { User } from '../../users/user.model';
import { appleSubscriptionScopes } from './scopes/apple-subscription.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';
import {
  AppleSubscriptionEnvironment,
  AppStoreReceiptResponse,
  PendingRenewalInfo,
} from './interfaces/app-store-connect';

@Scopes(() => appleSubscriptionScopes)
@Table({
  tableName: 'AppleSubscriptions',
})
export class AppleSubscription
  extends Model<IAppleSubscription, CreationAttributes<IAppleSubscription, 'id'>>
  implements IAppleSubscription
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
    unique: true,
    type: DataTypes.TEXT,
  })
  originalTransactionId!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  environment!: AppleSubscriptionEnvironment;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  productId!: string | null;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  isActive!: boolean;

  @Column({
    allowNull: true,
    type: DataTypes.DATE,
  })
  originalPurchaseDate!: Date | null;

  @Column({
    allowNull: true,
    type: DataTypes.DATE,
  })
  purchaseDate!: Date | null;

  @Column({
    allowNull: true,
    type: DataTypes.DATE,
  })
  expiresDate!: Date | null;

  @Column({
    allowNull: false,
    type: DataTypes.JSON,
  })
  data!: AppStoreReceiptResponse;

  @Column({
    allowNull: true,
    type: DataTypes.JSON,
  })
  renewalInfo!: PendingRenewalInfo[] | null;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  receipt!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  password!: string;

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
