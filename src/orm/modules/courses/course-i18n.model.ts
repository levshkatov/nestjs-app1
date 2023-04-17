import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { Lang } from '../../../shared/interfaces/lang.enum';
import { Course } from './course.model';
import { ICourseExtraDescription, ICourseI18n } from './interfaces/course-i18n.interface';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';

@Table({
  tableName: 'CoursesI18n',
})
export class CourseI18n
  extends Model<ICourseI18n, CreationAttributes<ICourseI18n, 'id'>>
  implements ICourseI18n
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
    type: DataTypes.TEXT,
  })
  lang!: Lang;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  name!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  duration!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  description!: string;

  @Column({
    allowNull: false,
    type: DataTypes.JSON,
  })
  extraDescription!: ICourseExtraDescription[];

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
