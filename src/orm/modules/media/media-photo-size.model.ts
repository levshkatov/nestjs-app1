import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { Media } from './media.model';
import { IMediaPhotoSize } from './interfaces/media-photo-size.interface';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';

@Table({
  tableName: 'MediaPhotoSizes',
})
export class MediaPhotoSize
  extends Model<IMediaPhotoSize, CreationAttributes<IMediaPhotoSize, 'id'>>
  implements IMediaPhotoSize
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
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  photoId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  size!: number;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  src!: string;

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
