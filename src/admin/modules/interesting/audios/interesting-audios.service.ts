import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { InterestingAudioOrmService } from '../../../../orm/modules/interesting/audios/interesting-audio-orm.service';
import { IInterestingAudio } from '../../../../orm/modules/interesting/audios/interfaces/interesting-audio.interface';
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
  InterestingAudiosForListDto,
  InterestingAudioCreateReqDto,
  InterestingAudioDetailedDto,
  InterestingAudioEditReqDto,
  InterestingAudiosReqDto,
} from './dtos/interesting-audio.dto';
import { InterestingAudiosMapper } from './interesting-audios.mapper';

@Injectable()
export class InterestingAudiosService {
  constructor(
    private i18n: I18nHelperService,
    private audios: InterestingAudioOrmService,
    private audiosMapper: InterestingAudiosMapper,
    private media: MediaOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    { limit, offset }: Pagination,
  ): Promise<InterestingAudiosForListDto> {
    const {
      pages,
      total,
      rows: audios,
    } = await this.audios.getAllAndCount(
      {
        offset,
        limit,
        order: [['id', 'DESC']],
      },
      ['i18n', 'audio'],
      `"InterestingAudio"."id"`,
    );

    return {
      pages,
      total,
      interestingAudios: audios.map((audio) =>
        this.audiosMapper.toInterestingAudioForListDto(i18n, audio),
      ),
    };
  }

  async create(
    i18n: I18nContext,
    { audioId, translations }: InterestingAudioCreateReqDto,
  ): Promise<OkDto> {
    this.i18n.checkFallbackLang(i18n, translations);

    if (!(await this.media.getOne({ where: { id: audioId, type: MediaType.audio } }))) {
      throw createError(i18n, 'create', 'media.audioNotFound');
    }

    const audio = await this.audios.create({ disabled: true, audioId });

    await this.audios.createI18n(
      this.i18n.createTranslations(translations, { interestingAudioId: audio.id }),
    );

    return new OkDto();
  }

  async getOne(i18n: I18nContext, id: number): Promise<InterestingAudioDetailedDto> {
    const audio = await this.audios.getOneFromAll({ where: { id } }, ['i18n', 'audio']);
    if (!audio) {
      throw createError(i18n, 'get', 'interesting.notFound');
    }

    return this.audiosMapper.toInterestingAudioDetailedDto(i18n, audio);
  }

  async edit(
    i18n: I18nContext,
    id: number,
    { audioId, translations, disabled }: InterestingAudioEditReqDto,
    { role }: IJWTUser,
  ): Promise<OkDto> {
    const audio = await this.audios.getOneFromAll({ where: { id } });
    if (!audio) {
      throw createError(i18n, 'edit', 'interesting.notFound');
    }

    this.i18n.checkFallbackLang(i18n, translations);

    const audioUpdate: Partial<GetRequired<IInterestingAudio>> = {};

    if (audioId !== audio.audioId) {
      if (!(await this.media.getOne({ where: { id: audioId, type: MediaType.audio } }))) {
        throw createError(i18n, 'edit', 'media.audioNotFound');
      }
      audioUpdate.audioId = audioId;
    }

    if (disabled !== undefined && disabled !== audio.disabled && role === UserRole.webAdmin) {
      audioUpdate.disabled = disabled;
    }

    if (Object.keys(audioUpdate).length) {
      await this.audios.update(audioUpdate, { where: { id } });
    }

    await this.audios.destroyI18n({ where: { interestingAudioId: id } });
    await this.audios.createI18n(
      this.i18n.createTranslations(translations, { interestingAudioId: id }),
    );

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    if ((await this.audios.destroy({ where: { id } })) !== 1) {
      throw createError(i18n, 'delete', 'interesting.notFound');
    }
    return new OkDto();
  }
}
