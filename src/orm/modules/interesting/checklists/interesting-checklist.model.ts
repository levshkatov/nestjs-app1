import { BelongsTo, Column, ForeignKey, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IInterestingChecklist } from './interfaces/interesting-checklist.interface';
import { InterestingChecklistI18n } from './interesting-checklist-i18n.model';
import { InterestingCategory } from '../categories/interesting-category.model';
import { Media } from '../../media/media.model';
import { Task } from '../../tasks/task.model';
import { interestingChecklistScopes } from './scopes/interesting-checklist.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => interestingChecklistScopes)
@Table({
  tableName: 'InterestingChecklists',
})
export class InterestingChecklist
  extends Model<IInterestingChecklist, CreationAttributes<IInterestingChecklist, 'id'>>
  implements IInterestingChecklist
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => InterestingCategory)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  categoryId!: number;

  @ForeignKey(() => Media)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  photoId!: number;

  @ForeignKey(() => Task)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  taskId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  disabled!: boolean;

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

  @HasMany(() => InterestingChecklistI18n, 'interestingChecklistId')
  i18n?: InterestingChecklistI18n[];

  @BelongsTo(() => Media, 'photoId')
  photo?: Media;

  @BelongsTo(() => Task, 'taskId')
  task?: Task;

  @BelongsTo(() => InterestingCategory, 'categoryId')
  category?: InterestingCategory;
}
