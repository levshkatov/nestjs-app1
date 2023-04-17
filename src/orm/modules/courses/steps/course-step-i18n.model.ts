import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { Lang } from '../../../../shared/interfaces/lang.enum';
import { CourseStep } from './course-step.model';
import { ICourseStepI18n } from './interfaces/course-step-i18n.interface';
import { CreationAttributes } from '../../../shared/interfaces/attributes.interface';

@Table({
  tableName: 'CourseStepsI18n',
})
export class CourseStepI18n
  extends Model<ICourseStepI18n, CreationAttributes<ICourseStepI18n, 'id'>>
  implements ICourseStepI18n
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => CourseStep)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  courseStepId!: number;

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
  description!: string;

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
