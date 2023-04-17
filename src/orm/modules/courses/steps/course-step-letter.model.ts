import { BelongsTo, Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ICourseStepLetter } from './interfaces/course-step-letter.interface';
import { Letter } from '../../letters/letter.model';
import { CourseStep } from './course-step.model';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';
import { courseStepLetterScopes } from './scopes/course-step-letter.scopes';

@Scopes(() => courseStepLetterScopes)
@Table({
  tableName: 'CourseStepLetters',
})
export class CourseStepLetter
  extends Model<ICourseStepLetter, CreationAttributes<ICourseStepLetter>>
  implements ICourseStepLetter
{
  @ForeignKey(() => CourseStep)
  @Column({
    primaryKey: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  courseStepId!: number;

  @ForeignKey(() => Letter)
  @Column({
    primaryKey: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  letterId!: number;

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

  @BelongsTo(() => Letter, 'letterId')
  letter?: Letter;

  @BelongsTo(() => CourseStep, 'courseStepId')
  courseStep?: CourseStep;
}
