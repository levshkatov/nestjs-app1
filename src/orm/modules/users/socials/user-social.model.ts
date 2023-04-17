import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IUserSocial } from './interfaces/user-social.interface';
import { User } from '../user.model';
import { SocialType } from './interfaces/social-type.enum';
import { userSocialScopes } from './scopes/user-social.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => userSocialScopes)
@Table({
  tableName: 'UserSocials',
})
export class UserSocial
  extends Model<IUserSocial, CreationAttributes<IUserSocial>>
  implements IUserSocial
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
    primaryKey: true,
    type: DataTypes.TEXT,
  })
  social!: SocialType;

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  id!: string;

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
