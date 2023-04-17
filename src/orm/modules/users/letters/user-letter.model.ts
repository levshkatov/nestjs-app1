import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IUserLetter } from './interfaces/user-letter.interface';
import { User } from '../user.model';
import { Letter } from '../../letters/letter.model';
import { userLetterScopes } from './scopes/user-letter.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => userLetterScopes)
@Table({
  tableName: 'UserLetters',
})
export class UserLetter
  extends Model<IUserLetter, CreationAttributes<IUserLetter>>
  implements IUserLetter
{
  @ForeignKey(() => User)
  @Column({
    primaryKey: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  userId!: number;

  @ForeignKey(() => Letter)
  @Column({
    primaryKey: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  letterId!: number;

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
