import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IUserVerifyCode } from './interfaces/user-verify-code.interface';
import { User } from '../user.model';
import { userVerifyCodeScopes } from './scopes/user-verify-code.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => userVerifyCodeScopes)
@Table({
  tableName: 'UserVerifyCodes',
})
export class UserVerifyCode
  extends Model<IUserVerifyCode, CreationAttributes<IUserVerifyCode>>
  implements IUserVerifyCode
{
  @ForeignKey(() => User)
  @Column({
    primaryKey: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  userId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  code!: number;

  @Column({
    allowNull: false,
    type: DataTypes.DATE,
  })
  expireAt!: Date;

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
