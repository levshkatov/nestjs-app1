import { BelongsTo, Column, ForeignKey, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ILevel } from './interfaces/level.interface';
import { LevelI18n } from './level-i18n.model';
import { Media } from '../media/media.model';
import { levelScopes } from './scopes/level.scopes';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';

@Scopes(() => levelScopes)
@Table({
  tableName: 'Levels',
})
export class Level extends Model<ILevel, CreationAttributes<ILevel, 'id'>> implements ILevel {
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

  @ForeignKey(() => Media)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  photoId!: number;

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

  @HasMany(() => LevelI18n, 'levelId')
  i18n?: LevelI18n[];

  @BelongsTo(() => Media, 'photoId')
  photo?: Media;
}
