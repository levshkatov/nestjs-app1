import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ICelebrity } from './interfaces/celebrity.interface';
import { CelebrityI18n } from './celebrity-i18n.model';
import { Media } from '../media/media.model';
import { CelebrityHabit } from './celebrity-habit.model';
import { celebrityScopes } from './scopes/celebrity.scopes';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';

@Scopes(() => celebrityScopes)
@Table({
  tableName: 'Celebrities',
})
export class Celebrity
  extends Model<ICelebrity, CreationAttributes<ICelebrity, 'id'>>
  implements ICelebrity
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

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  disabled!: boolean;

  @Column({
    allowNull: true,
    unique: true,
    type: DataTypes.TEXT,
  })
  tag!: string | null;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 1000,
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

  @HasMany(() => CelebrityI18n, 'celebrityId')
  i18n?: CelebrityI18n[];

  @HasMany(() => CelebrityHabit, 'celebrityId')
  celebrityHabits?: CelebrityHabit[];

  @BelongsTo(() => Media, 'photoId')
  photo?: Media;
}
