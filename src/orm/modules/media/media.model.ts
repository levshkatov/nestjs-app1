import { BelongsTo, Column, ForeignKey, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { MediaExtension } from './interfaces/media-extension.enum';
import { MediaType } from './interfaces/media-type.enum';
import { IMedia } from './interfaces/media.interface';
import { MediaPhotoSize } from './media-photo-size.model';
import { User } from '../users/user.model';
import { mediaScopes } from './scopes/media.scopes';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';

@Scopes(() => mediaScopes)
@Table({
  tableName: 'Media',
})
export class Media extends Model<IMedia, CreationAttributes<IMedia, 'id'>> implements IMedia {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    allowNull: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  authorId!: number | null;

  @Column({
    allowNull: true,
    unique: true,
    type: DataTypes.TEXT,
  })
  tag!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  originalName!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  size!: number | null;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  type!: MediaType;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  extension!: MediaExtension;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  src!: string;

  // for images only
  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  blurHash!: string | null;

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

  @HasMany(() => MediaPhotoSize, 'photoId')
  photoSizes?: MediaPhotoSize[];

  @BelongsTo(() => User, 'authorId')
  author?: User;
}
