import { BelongsTo, Column, ForeignKey, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ITree } from './interfaces/tree.interface';
import { TreeI18n } from './tree-i18n.model';
import { Media } from '../media/media.model';
import { treeScopes } from './scopes/tree.scopes';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';

@Scopes(() => treeScopes)
@Table({
  tableName: 'Trees',
})
export class Tree extends Model<ITree, CreationAttributes<ITree, 'id'>> implements ITree {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  index!: number;

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

  @ForeignKey(() => Media)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  photoId!: number;

  @HasMany(() => TreeI18n, 'treeId')
  i18n?: TreeI18n[];

  @BelongsTo(() => Media, 'photoId')
  photo?: Media;
}
