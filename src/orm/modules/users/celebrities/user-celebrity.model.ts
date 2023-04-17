import { BelongsTo, Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IUserCelebrity } from './interfaces/user-celebrity.interface';
import { User } from '../user.model';
import { Celebrity } from '../../celebrities/celebrity.model';
import { userCelebrityScopes } from './scopes/user-celebrity.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => userCelebrityScopes)
@Table({
  tableName: 'UserCelebrities',
})
export class UserCelebrity
  extends Model<IUserCelebrity, CreationAttributes<IUserCelebrity>>
  implements IUserCelebrity
{
  @ForeignKey(() => User)
  @Column({
    primaryKey: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  userId!: number;

  @ForeignKey(() => Celebrity)
  @Column({
    primaryKey: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  celebrityId!: number;

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

  @BelongsTo(() => Celebrity, 'celebrityId')
  celebrity?: Celebrity;
}
