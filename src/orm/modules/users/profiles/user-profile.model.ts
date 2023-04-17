import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { User } from '../user.model';
import { IUserProfile } from './interfaces/user-profile.interface';
import { userProfileScopes } from './scopes/user-profile.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => userProfileScopes)
@Table({
  tableName: 'UserProfiles',
})
export class UserProfile
  extends Model<IUserProfile, CreationAttributes<IUserProfile>>
  implements IUserProfile
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
    type: DataTypes.STRING,
  })
  name!: string;

  @Column({
    allowNull: true,
    type: DataTypes.DATEONLY,
  })
  birthdate!: Date | null;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  waterBalance!: number;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  totalTasks!: number;

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
