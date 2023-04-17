import { BelongsTo, Column, ForeignKey, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { ICourseStep } from './interfaces/course-step.interface';
import { CourseStepI18n } from './course-step-i18n.model';
import { CourseStepLetter } from './course-step-letter.model';
import { Course } from '../course.model';
import { Media } from '../../media/media.model';
import { courseStepScopes } from './scopes/course-step.scopes';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';
import { CourseStepExercise } from './exercises/course-step-exercise.model';

@Scopes(() => courseStepScopes)
@Table({
  tableName: 'CourseSteps',
})
export class CourseStep
  extends Model<ICourseStep, CreationAttributes<ICourseStep, 'id'>>
  implements ICourseStep
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => Course)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  courseId!: number;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  index!: number;

  @ForeignKey(() => Media)
  @Column({
    allowNull: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  photoId!: number | null;

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

  @HasMany(() => CourseStepI18n, 'courseStepId')
  i18n?: CourseStepI18n[];

  @HasMany(() => CourseStepLetter, 'courseStepId')
  courseStepLetters?: CourseStepLetter[];

  @HasMany(() => CourseStepExercise, 'courseStepId')
  courseStepExercises?: CourseStepExercise[];

  @BelongsTo(() => Media, 'photoId')
  photo?: Media;

  @BelongsTo(() => Course, 'courseId')
  course?: Course;
}
