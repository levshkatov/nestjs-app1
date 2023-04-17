import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { UserDto } from '../../shared/dtos/user.dto';
import { PopUpService } from '../pop-up/pop-up.service';
import { UserDeleteDto, UserEditReqDto } from './dtos/user.dto';
import { UsersMapper } from './users.mapper';
import { AuthService } from '../auth/auth.service';
import { HomeScreenDto } from './dtos/home-screen.dto';
import { HomeScreenType } from './interfaces/home-screen-type.enum';
import { UserOrmService } from '../../../orm/modules/users/user-orm.service';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { OkDto } from '../../../shared/dtos/responses.dto';
import { UserProfileOrmService } from '../../../orm/modules/users/profiles/user-profile-orm.service';
import { omitNullProps } from '../../../shared/helpers/omit-null-props.helper';
import { CourseType } from '../../../orm/modules/courses/interfaces/course-type.enum';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { LevelDto } from '../levels/dtos/level.dto';
import { LevelsService } from '../levels/levels.service';
import { TreeDto } from '../trees/dtos/tree.dto';
import { TreesService } from '../trees/trees.service';
import { UserCelebrityOrmService } from '../../../orm/modules/users/celebrities/user-celebrity-orm.service';
import { UserCelebrityDto } from './dtos/user-celebrity.dto';

@Injectable()
export class UsersService {
  constructor(
    private popup: PopUpService,
    private users: UserOrmService,
    private profiles: UserProfileOrmService,
    private usersMapper: UsersMapper,
    private auth: AuthService,
    private trees: TreesService,
    private levels: LevelsService,
    private userCelebrities: UserCelebrityOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getOne(i18n: I18nContext, { userId }: IJWTUser): Promise<UserDto> {
    const user = await this.users.getOneType({ where: { id: userId } }, 'mobile', ['profile']);
    if (!user) {
      throw this.popup.error(i18n, `users.notFound`);
    }
    return this.usersMapper.toUserDto(i18n, user);
  }

  async edit(
    i18n: I18nContext,
    {
      name,
      email,
      // phone,
      birthdate,
    }: UserEditReqDto,
    user: IJWTUser,
  ): Promise<UserDto | OkDto> {
    const { userId } = user;
    // fix when adding phone auth
    // if (phone && phone !== user.phone) {
    //   await this.users.update({ newPhone: phone }, { where: { id: user.id } });

    //   await this.auth.createSmsCode(i18n, user.id);
    //   await this.auth.sendSms();

    //   res.status(HttpStatus.OK);
    //   return new OkDto();
    // }

    await this.profiles.update(omitNullProps({ name, birthdate }), { where: { userId } });
    await this.users.update(omitNullProps({ email }), { where: { id: userId } });

    return await this.getOne(i18n, user);
  }

  async delete(i18n: I18nContext, { force }: UserDeleteDto, { userId }: IJWTUser): Promise<OkDto> {
    const user = await this.users.getOneType({ where: { id: userId } }, 'mobile');
    if (!user) {
      throw this.popup.error(i18n, `users.notFound`);
    }

    if (!force) {
      throw this.popup.question(i18n, `users.deleteUser`);
    }

    await this.users.destroy({ where: { id: userId } });

    return new OkDto();
  }

  async getHomeScreen(i18n: I18nContext, { userId }: IJWTUser): Promise<HomeScreenDto> {
    const user = await this.users.getOneType({ where: { id: userId } }, 'mobile', [
      'coursesActive',
    ]);

    const userCelebrity = await this.userCelebrities.getOne({ where: { userId } });
    if (userCelebrity) {
      return new HomeScreenDto({ type: HomeScreenType.celebrity });
    }

    if (user?.courses[0]) {
      return new HomeScreenDto({
        type:
          user.courses[0].type === CourseType.mountain
            ? HomeScreenType.mountain
            : HomeScreenType.category,
      });
    }

    return new HomeScreenDto({ type: HomeScreenType.habits });
  }

  async getLevel(i18n: I18nContext, { userId }: IJWTUser): Promise<LevelDto> {
    const user = await this.users.getOneType({ where: { id: userId } }, 'mobile', ['profile']);
    if (!user) {
      throw this.popup.error(i18n, `users.notFound`);
    }

    const {
      profile: { totalTasks },
    } = user;

    return this.levels.get(i18n, totalTasks);
  }

  async getTree(i18n: I18nContext, { userId }: IJWTUser): Promise<TreeDto> {
    const user = await this.users.getOneType({ where: { id: userId } }, 'mobile', ['profile']);
    if (!user) {
      throw this.popup.error(i18n, `users.notFound`);
    }

    const {
      profile: { totalTasks },
    } = user;

    return this.trees.get(i18n, totalTasks);
  }

  async getCelebrity(i18n: I18nContext, { userId }: IJWTUser): Promise<UserCelebrityDto> {
    const userCelebrity = await this.userCelebrities.getOneFromAll({ where: { userId } }, [
      'celebrity',
    ]);
    if (!userCelebrity) {
      throw this.popup.error(i18n, `celebrities.notFound`);
    }

    return this.usersMapper.toUserCelebrityDto(i18n, userCelebrity.celebrity);
  }
}
