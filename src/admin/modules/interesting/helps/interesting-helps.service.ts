import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { InterestingHelpOrmService } from '../../../../orm/modules/interesting/helps/interesting-help-orm.service';
import { IInterestingHelp } from '../../../../orm/modules/interesting/helps/interfaces/interesting-help.interface';
import { MediaType } from '../../../../orm/modules/media/interfaces/media-type.enum';
import { MediaOrmService } from '../../../../orm/modules/media/media-orm.service';
import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import { OkDto } from '../../../../shared/dtos/responses.dto';
import { createError } from '../../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../../shared/interfaces/paginated.interface';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import {
  InterestingHelpsForListDto,
  InterestingHelpCreateReqDto,
  InterestingHelpDetailedDto,
  InterestingHelpEditReqDto,
  InterestingHelpsReqDto,
} from './dtos/interesting-help.dto';
import { InterestingHelpsMapper } from './interesting-helps.mapper';

@Injectable()
export class InterestingHelpsService {
  constructor(
    private i18n: I18nHelperService,
    private helps: InterestingHelpOrmService,
    private helpsMapper: InterestingHelpsMapper,
    private media: MediaOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    { limit, offset }: Pagination,
  ): Promise<InterestingHelpsForListDto> {
    const {
      pages,
      total,
      rows: helps,
    } = await this.helps.getAllAndCount(
      {
        offset,
        limit,
        order: [['id', 'DESC']],
      },
      ['i18n', 'audio', 'photo'],
      `"InterestingHelp"."id"`,
    );

    return {
      pages,
      total,
      interestingHelps: helps.map((help) =>
        this.helpsMapper.toInterestingHelpForListDto(i18n, help),
      ),
    };
  }

  async create(
    i18n: I18nContext,
    { audioId, photoId, translations }: InterestingHelpCreateReqDto,
  ): Promise<OkDto> {
    this.i18n.checkFallbackLang(i18n, translations);

    if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
      throw createError(i18n, 'create', 'media.photoNotFound');
    }

    if (!(await this.media.getOne({ where: { id: audioId, type: MediaType.audio } }))) {
      throw createError(i18n, 'create', 'media.audioNotFound');
    }

    const help = await this.helps.create({ disabled: true, photoId, audioId });

    await this.helps.createI18n(
      this.i18n.createTranslations(translations, { interestingHelpId: help.id }),
    );

    return new OkDto();
  }

  async getOne(i18n: I18nContext, id: number): Promise<InterestingHelpDetailedDto> {
    const help = await this.helps.getOneFromAll({ where: { id } }, ['i18n', 'audio', 'photo']);
    if (!help) {
      throw createError(i18n, 'get', 'interesting.notFound');
    }

    return this.helpsMapper.toInterestingHelpDetailedDto(i18n, help);
  }

  async edit(
    i18n: I18nContext,
    id: number,
    { audioId, photoId, translations, disabled }: InterestingHelpEditReqDto,
    { role }: IJWTUser,
  ): Promise<OkDto> {
    const help = await this.helps.getOneFromAll({ where: { id } });
    if (!help) {
      throw createError(i18n, 'edit', 'interesting.notFound');
    }

    this.i18n.checkFallbackLang(i18n, translations);

    const helpUpdate: Partial<GetRequired<IInterestingHelp>> = {};

    if (photoId !== help.photoId) {
      if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
        throw createError(i18n, 'edit', 'media.photoNotFound');
      }
      helpUpdate.photoId = photoId;
    }

    if (audioId !== help.audioId) {
      if (!(await this.media.getOne({ where: { id: audioId, type: MediaType.audio } }))) {
        throw createError(i18n, 'edit', 'media.audioNotFound');
      }
      helpUpdate.audioId = audioId;
    }

    if (disabled !== undefined && disabled !== help.disabled && role === UserRole.webAdmin) {
      helpUpdate.disabled = disabled;
    }

    if (Object.keys(helpUpdate).length) {
      await this.helps.update(helpUpdate, { where: { id } });
    }

    await this.helps.destroyI18n({ where: { interestingHelpId: id } });
    await this.helps.createI18n(
      this.i18n.createTranslations(translations, { interestingHelpId: id }),
    );

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    if ((await this.helps.destroy({ where: { id } })) !== 1) {
      throw createError(i18n, 'delete', 'interesting.notFound');
    }
    return new OkDto();
  }
}
