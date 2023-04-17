import { BelongsTo, Column, ForeignKey, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IInterestingAudio } from './interfaces/interesting-audio.interface';
import { InterestingAudioI18n } from './interesting-audio-i18n.model';
import { Media } from '../../media/media.model';
import { interestingAudioScopes } from './scopes/interesting-audio.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Scopes(() => interestingAudioScopes)
@Table({
  tableName: 'InterestingAudios',
})
export class InterestingAudio
  extends Model<IInterestingAudio, CreationAttributes<IInterestingAudio, 'id'>>
  implements IInterestingAudio
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
  audioId!: number;

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

  @HasMany(() => InterestingAudioI18n, 'interestingAudioId')
  i18n?: InterestingAudioI18n[];

  @BelongsTo(() => Media, 'audioId')
  audio?: Media;
}
