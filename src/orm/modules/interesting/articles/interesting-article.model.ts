import { BelongsTo, Column, ForeignKey, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IInterestingArticle } from './interfaces/interesting-article.interface';
import { InterestingArticleI18n } from './interesting-article-i18n.model';
import { Media } from '../../media/media.model';
import { Task } from '../../tasks/task.model';
import { interestingArticleScopes } from './scopes/interesting-article.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => interestingArticleScopes)
@Table({
  tableName: 'InterestingArticles',
})
export class InterestingArticle
  extends Model<IInterestingArticle, CreationAttributes<IInterestingArticle, 'id'>>
  implements IInterestingArticle
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

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

  @HasMany(() => InterestingArticleI18n, 'interestingArticleId')
  i18n?: InterestingArticleI18n[];

  @BelongsTo(() => Media, 'photoId')
  photo?: Media;

  @BelongsTo(() => Task, 'taskId')
  task?: Task;
}
