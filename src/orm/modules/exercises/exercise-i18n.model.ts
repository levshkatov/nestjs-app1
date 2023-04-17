import { Column, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { Lang } from '../../../shared/interfaces/lang.enum';
import { Exercise } from './exercise.model';
import { IExerciseI18n } from './interfaces/exercise-i18n.interface';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';

@Table({
  tableName: 'ExercisesI18n',
})
export class ExerciseI18n
  extends Model<IExerciseI18n, CreationAttributes<IExerciseI18n, 'id'>>
  implements IExerciseI18n
{
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id!: number;

  @ForeignKey(() => Exercise)
  @Column({
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    type: DataTypes.INTEGER,
  })
  exerciseId!: number;

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
    type: DataTypes.TEXT,
  })
  goal!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  author!: string;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  source!: string;

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
