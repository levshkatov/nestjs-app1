import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IUserClaim } from './interfaces/user-claim.interface';
import { User } from '../user.model';
import { userClaimScopes } from './scopes/user-claim.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => userClaimScopes)
@Table({
  tableName: 'UserClaims',
})
export class UserClaim
  extends Model<IUserClaim, CreationAttributes<IUserClaim, 'id'>>
  implements IUserClaim
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
  name!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  email!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  text!: string;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  isResolved!: boolean;

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
