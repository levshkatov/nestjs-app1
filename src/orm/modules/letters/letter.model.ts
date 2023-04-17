import { Column, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ILetter } from './interfaces/letter.interface';
import { LetterI18n } from './letter-i18n.model';
import { LetterTrigger } from './interfaces/letter-trigger.enum';
import { letterScopes } from './scopes/letter.scopes';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';
import { CourseStepLetter } from '../courses/steps/course-step-letter.model';

@Scopes(() => letterScopes)
@Table({
  tableName: 'Letters',
})
export class Letter extends Model<ILetter, CreationAttributes<ILetter, 'id'>> implements ILetter {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  trigger!: LetterTrigger;

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

  @HasMany(() => LetterI18n, 'letterId')
  i18n?: LetterI18n[];

  @HasMany(() => CourseStepLetter, 'letterId')
  courseStepLetters?: CourseStepLetter[];
}
