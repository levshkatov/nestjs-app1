import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Op } from 'sequelize';
import { CelebrityOrmService } from '../../../orm/modules/celebrities/celebrity-orm.service';
import { ICelebrity } from '../../../orm/modules/celebrities/interfaces/celebrity.interface';
import { HabitOrmService } from '../../../orm/modules/habits/habit-orm.service';
import { MediaType } from '../../../orm/modules/media/interfaces/media-type.enum';
import { MediaOrmService } from '../../../orm/modules/media/media-orm.service';
import { UserCelebrityOrmService } from '../../../orm/modules/users/celebrities/user-celebrity-orm.service';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { OkDto } from '../../../shared/dtos/responses.dto';
import { createDisclaimer } from '../../../shared/helpers/create-disclaimer.helper';
import { createError, ErrorTitle } from '../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { CelebritiesMapper } from './celebrities.mapper';
import {
  CelebritiesForListDto,
  CelebritiesReqDto,
  CelebrityCreateReqDto,
  CelebrityDetailedDto,
  CelebrityEditReqDto,
} from './dtos/celebrity.dto';
import { CELEBRITY_HABITS_LENGTH } from './interfaces/celebrity.constants';

@Injectable()
export class CelebritiesService {
  constructor(
    private i18n: I18nHelperService,
    private celebrities: CelebrityOrmService,
    private celebritiesMapper: CelebritiesMapper,
    private media: MediaOrmService,
    private habits: HabitOrmService,
    private userCelebrities: UserCelebrityOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    pagination: Pagination,
    dto: CelebritiesReqDto,
  ): Promise<CelebritiesForListDto> {
    const { pages, total, celebrities } = await this.celebrities.getAllAdmin(pagination, dto);

    return {
      pages,
      total,
      celebrities: celebrities.map((celebrity) =>
        this.celebritiesMapper.toCelebrityForListDto(i18n, celebrity),
      ),
      disclaimer: createDisclaimer(i18n, 'celebrities.forbiddenIfUsed'),
    };
  }

  async create(
    i18n: I18nContext,
    { photoId, habitsIds, translations, index, tag }: CelebrityCreateReqDto,
  ): Promise<OkDto> {
    this.i18n.checkFallbackLang(i18n, translations);

    if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
      throw createError(i18n, 'create', 'media.photoNotFound');
    }

    await this.checkHabits(i18n, 'create', habitsIds);

    if (tag) {
      if (!!(await this.celebrities.getOne({ where: { tag } }))) {
        throw createError(i18n, 'create', 'celebrities.tagExisting');
      }
    }

    const celebrity = await this.celebrities.create({
      photoId,
      disabled: true,
      index,
      tag,
    });

    await this.celebrities.createI18n(
      this.i18n.createTranslations(translations, { celebrityId: celebrity.id }),
    );

    await this.celebrities.createHabits(
      habitsIds.map((habitId) => ({ celebrityId: celebrity.id, habitId })),
    );

    return new OkDto();
  }

  async getOne(i18n: I18nContext, id: number): Promise<CelebrityDetailedDto> {
    const celebrity = await this.celebrities.getOneFromAll(
      {
        where: { id },
      },
      ['i18n', 'celebrityHabits', 'photo'],
    );
    if (!celebrity) {
      throw createError(i18n, 'get', 'celebrities.notFound');
    }

    const celebrityIsUsed = !!(await this.userCelebrities.getOne({ where: { celebrityId: id } }));

    return this.celebritiesMapper.toCelebrityDetailedDto(
      i18n,
      celebrity,
      celebrityIsUsed
        ? createDisclaimer(i18n, 'celebrities.isUsed', 'celebrities.forbiddenIfUsed')
        : undefined,
    );
  }

  async edit(
    i18n: I18nContext,
    id: number,
    { photoId, habitsIds, translations, disabled, index, tag }: CelebrityEditReqDto,
    { role }: IJWTUser,
  ): Promise<OkDto> {
    const celebrity = await this.celebrities.getOneFromAll({ where: { id } }, ['celebrityHabits']);
    if (!celebrity) {
      throw createError(i18n, 'edit', 'celebrities.notFound');
    }

    this.i18n.checkFallbackLang(i18n, translations);

    const celebrityIsUsed = !!(await this.userCelebrities.getOne({ where: { celebrityId: id } }));

    const celebrityUpdate: Partial<GetRequired<ICelebrity>> = {};

    if (photoId !== celebrity.photoId) {
      if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
        throw createError(i18n, 'edit', 'media.photoNotFound');
      }
      celebrityUpdate.photoId = photoId;
    }

    if (disabled !== undefined && disabled !== celebrity.disabled && role === UserRole.webAdmin) {
      if (disabled === true && celebrityIsUsed) {
        throw createError(i18n, 'edit', 'celebrities.celebrityHasUsers');
      }
      celebrityUpdate.disabled = disabled;
    }

    if (tag && tag !== celebrity.tag) {
      if (!!(await this.celebrities.getOne({ where: { tag } }))) {
        throw createError(i18n, 'edit', 'celebrities.tagExisting');
      }
      celebrityUpdate.tag = tag;
    }

    if (index !== celebrity.index) {
      celebrityUpdate.index = index;
    }

    if (Object.keys(celebrityUpdate).length) {
      await this.celebrities.update(celebrityUpdate, { where: { id } });
    }

    // works because habits length is always CELEBRITY_HABITS_LENGTH
    // if length is arbitrary, rewrite code
    if (
      !celebrity.celebrityHabits.every(({ habitId }) => !!habitsIds.find((id2) => id2 === habitId))
    ) {
      if (celebrityIsUsed) {
        throw createError(i18n, 'edit', 'celebrities.celebrityHasUsers');
      }

      await this.checkHabits(i18n, 'edit', habitsIds);

      await this.celebrities.destroyHabits({ where: { celebrityId: id } });

      await this.celebrities.createHabits(
        habitsIds.map((habitId) => ({ celebrityId: id, habitId })),
      );
    }

    await this.celebrities.destroyI18n({ where: { celebrityId: id } });
    await this.celebrities.createI18n(
      this.i18n.createTranslations(translations, { celebrityId: id }),
    );

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    const celebrityIsUsed = !!(await this.userCelebrities.getOne({ where: { celebrityId: id } }));
    if (celebrityIsUsed) {
      throw createError(i18n, 'edit', 'celebrities.celebrityHasUsers');
    }

    if ((await this.celebrities.destroy({ where: { id } })) !== 1) {
      throw createError(i18n, 'delete', 'celebrities.notFound');
    }
    return new OkDto();
  }

  private async checkHabits(
    i18n: I18nContext,
    errorTitle: ErrorTitle,
    habitsIds: number[],
  ): Promise<void> {
    try {
      if (
        !habitsIds?.length ||
        habitsIds.length !== CELEBRITY_HABITS_LENGTH ||
        new Set(habitsIds).size !== CELEBRITY_HABITS_LENGTH
      ) {
        throw new Error();
      }

      const habits = await this.habits.getAll({
        where: { id: { [Op.in]: habitsIds }, disabled: false },
      });
      if (!habits.length || habits.length !== habitsIds.length) {
        throw new Error();
      }
    } catch (e) {
      throw createError(
        i18n,
        errorTitle,
        null,
        i18n.t('errors.celebrities.wrongHabits', { args: { length: CELEBRITY_HABITS_LENGTH } }),
      );
    }
  }
}
