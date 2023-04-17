import { BelongsToMany, Column, HasMany, HasOne, Model, Scopes, Table } from 'sequelize-typescript';
import { DataTypes, Sequelize } from 'sequelize';
import { IUser } from './interfaces/user.interface';
import { UserSocial } from './socials/user-social.model';
import { UserVerifyCode } from './verify-codes/user-verify-code.model';
import { Habit } from '../habits/habit.model';
import { UserHabit } from './habits/user-habit.model';
import { Course } from '../courses/course.model';
import { Media } from '../media/media.model';
import { UserProfile } from './profiles/user-profile.model';
import { UserClaim } from './claims/user-claim.model';
import { UserSession } from './sessions/user-session.model';
import { UserRole } from './interfaces/user-role.enum';
import { OffsetUTC } from '../../../shared/interfaces/offset-utc.enum';
import { HabitCategoryBalance } from '../habits/categories/balances/habit-category-balance.model';
import { UserBalance } from './balances/user-balance.model';
import { Letter } from '../letters/letter.model';
import { UserLetter } from './letters/user-letter.model';
import { UserCourse } from './courses/user-course.model';
import { UserHabitData } from './habit-datas/user-habit-data.model';
import { InterestingChecklist } from '../interesting/checklists/interesting-checklist.model';
import { userScopes } from './scopes/user.scopes';
import { CreationAttributes } from '../../shared/interfaces/attributes.interface';
import { UserInterestingChecklistData } from './interesting-checklist-datas/user-interesting-checklist-data.model';
import { Lang } from '../../../shared/interfaces/lang.enum';

@Scopes(() => userScopes)
@Table({
  tableName: 'Users',
})
export class User extends Model<IUser, CreationAttributes<IUser, 'id'>> implements IUser {
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
  role!: UserRole;

  @Column({
    allowNull: true,
    type: DataTypes.STRING,
  })
  phone!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.STRING,
  })
  email!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.STRING,
  })
  username!: string | null;

  @Column({
    allowNull: true,
    type: DataTypes.STRING,
  })
  passwordHash!: string | null;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  offsetUTC!: OffsetUTC;

  @Column({
    allowNull: true,
    type: DataTypes.STRING,
  })
  newPhone!: string | null;

  @Column({
    allowNull: false,
    type: DataTypes.TEXT,
  })
  lang!: Lang;

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

  @BelongsToMany(() => HabitCategoryBalance, () => UserBalance)
  balances?: HabitCategoryBalance[];

  @HasMany(() => UserClaim, 'userId')
  claims?: UserClaim[];

  @BelongsToMany(() => InterestingChecklist, () => UserInterestingChecklistData)
  checklistDatas?: InterestingChecklist[];

  @BelongsToMany(() => Course, () => UserCourse)
  courses?: Course[];

  @BelongsToMany(() => Habit, () => UserHabit)
  habits?: Habit[];

  @HasMany(() => UserHabitData, 'userId')
  habitDatas?: UserHabitData[];

  @BelongsToMany(() => Letter, () => UserLetter)
  letters?: Letter[];

  @HasOne(() => UserProfile, 'userId')
  profile?: UserProfile;

  @HasMany(() => UserSession, 'userId')
  sessions?: UserSession[];

  @HasMany(() => UserSocial, 'userId')
  socials?: UserSocial[];

  @HasOne(() => UserVerifyCode, 'userId')
  verifyCode?: UserVerifyCode;

  @HasMany(() => Media, 'authorId')
  uploads?: Media[];
}
