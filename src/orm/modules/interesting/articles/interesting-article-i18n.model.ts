import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { Lang } from '../../../../shared/interfaces/lang.enum';
import { InterestingArticle } from './interesting-article.model';
import { IInterestingArticleI18n } from './interfaces/interesting-article-i18n.interface';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Table({
  tableName: 'InterestingArticlesI18n',
})
export class InterestingArticleI18n
  extends Model<IInterestingArticleI18n, CreationAttributes<IInterestingArticleI18n, 'id'>>
  implements IInterestingArticleI18n
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => InterestingArticle)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  interestingArticleId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  lang!: Lang;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  title!: string;

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
