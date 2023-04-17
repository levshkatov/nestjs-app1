import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IUserInterestingChecklistData } from './interfaces/user-interesting-checklist-data.interface';
import { User } from '../user.model';
import { ITaskContent } from '../../tasks/interfaces/task-i18n.interface';
import { InterestingChecklist } from '../../interesting/checklists/interesting-checklist.model';
import { userInterestingChecklistDataScopes } from './scopes/user-interesting-checklist-data.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => userInterestingChecklistDataScopes)
@Table({
  tableName: 'UserInterestingChecklistDatas',
})
export class UserInterestingChecklistData
  extends Model<IUserInterestingChecklistData, CreationAttributes<IUserInterestingChecklistData>>
  implements IUserInterestingChecklistData
{
  @ForeignKey(() => User)
  @Column({
    primaryKey: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  userId!: number;

  @ForeignKey(() => InterestingChecklist)
  @Column({
    primaryKey: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  interestingChecklistId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.JSON,
  })
  content!: ITaskContent[];

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
