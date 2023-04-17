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
import { ICourse } from './interfaces/course.interface';
import { CourseI18n } from './course-i18n.model';
import { Media } from '../media/media.model';
import { CourseType } from './interfaces/course-type.enum';
import { CourseHabit } from './course-habit.model';
import { courseScopes } from './scopes/course.scopes';
import { CourseStep } from './steps/course-step.model';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';

@Scopes(() => courseScopes)
@Table({
  tableName: 'Courses',
})
export class Course extends Model<ICourse, CreationAttributes<ICourse, 'id'>> implements ICourse {
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

  @ForeignKey(() => Media)
  @Column({
    allowNull: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  photoInactiveId!: number | null;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  type!: CourseType;

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

  @HasMany(() => CourseI18n, 'courseId')
  i18n?: CourseI18n[];

  @BelongsTo(() => Media, 'photoId')
  photo?: Media;

  @BelongsTo(() => Media, 'photoInactiveId')
  photoInactive?: Media;

  @HasMany(() => CourseHabit, 'courseId')
  courseHabits?: CourseHabit[];

  @HasMany(() => CourseStep, 'courseId')
  steps?: CourseStep[];
}
