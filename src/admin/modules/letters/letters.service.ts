import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ILetter, LetterScopesMap } from '../../../orm/modules/letters/interfaces/letter.interface';
import { LetterOrmService } from '../../../orm/modules/letters/letter-orm.service';
import { UserLetterOrmService } from '../../../orm/modules/users/letters/user-letter-orm.service';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { OkDto } from '../../../shared/dtos/responses.dto';
import { createDisclaimer } from '../../../shared/helpers/create-disclaimer.helper';
import { createError, ErrorTitle } from '../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import {
  LettersForListDto,
  LetterCreateReqDto,
  LetterDetailedDto,
  LetterEditReqDto,
  LettersReqDto,
} from './dtos/letter.dto';
import { LettersMapper } from './letters.mapper';

@Injectable()
export class LettersService {
  constructor(
    private i18n: I18nHelperService,
    private letters: LetterOrmService,
    private lettersMapper: LettersMapper,
    private userLetters: UserLetterOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    pagination: Pagination,
    dto: LettersReqDto,
  ): Promise<LettersForListDto> {
    const { pages, total, letters } = await this.letters.getAllAdmin(pagination, dto);

    return {
      pages,
      total,
      letters: letters.map((letter) => this.lettersMapper.toLetterForListDto(i18n, letter)),
      disclaimer: createDisclaimer(i18n, 'letters.forbiddenIfUsed', 'letters.forbiddenIfHasLinked'),
    };
  }

  async create(i18n: I18nContext, { trigger, translations }: LetterCreateReqDto): Promise<OkDto> {
    this.i18n.checkFallbackLang(i18n, translations);

    const letter = await this.letters.create({ trigger });

    await this.letters.createI18n(
      this.i18n.createTranslations(translations, { letterId: letter.id }),
    );

    return new OkDto();
  }

  async getOne(i18n: I18nContext, id: number): Promise<LetterDetailedDto> {
    const [letter, letterIsUsed] = await this.getLetter(i18n, 'get', id);

    return this.lettersMapper.toLetterDetailedDto(
      i18n,
      letter,
      letterIsUsed
        ? createDisclaimer(i18n, 'letters.isUsed', 'letters.forbiddenIfUsed')
        : letter.courseStepLetters.length
        ? createDisclaimer(i18n, 'letters.forbiddenIfHasLinked')
        : undefined,
    );
  }

  async edit(
    i18n: I18nContext,
    id: number,
    { trigger, translations }: LetterEditReqDto,
  ): Promise<OkDto> {
    const [letter, letterIsUsed] = await this.getLetter(i18n, 'edit', id);

    this.i18n.checkFallbackLang(i18n, translations);

    const letterUpdate: Partial<GetRequired<ILetter>> = {};

    if (trigger !== letter.trigger) {
      if (letter.courseStepLetters.length || letterIsUsed) {
        throw createError(i18n, 'edit', 'letters.isUsed');
      }
      letterUpdate.trigger = trigger;
    }

    if (Object.keys(letterUpdate).length) {
      await this.letters.update(letterUpdate, { where: { id } });
    }

    await this.letters.destroyI18n({ where: { letterId: id } });
    await this.letters.createI18n(this.i18n.createTranslations(translations, { letterId: id }));

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    const [letter, letterIsUsed] = await this.getLetter(i18n, 'delete', id);

    if (letterIsUsed || letter.courseStepLetters.length) {
      throw createError(i18n, 'delete', 'letters.isUsed');
    }

    if ((await this.letters.destroy({ where: { id } })) !== 1) {
      throw createError(i18n, 'delete', 'letters.notFound');
    }
    return new OkDto();
  }

  private async getLetter(
    i18n: I18nContext,
    errorTitle: ErrorTitle,
    id: number,
  ): Promise<[BS<ILetter, LetterScopesMap, 'courseStepLetters' | 'i18n'>, boolean]> {
    const letter = await this.letters.getOneFromAll({ where: { id } }, [
      'i18n',
      'courseStepLetters',
    ]);
    if (!letter) {
      throw createError(i18n, errorTitle, 'letters.notFound');
    }

    const letterIsUsed = !!(await this.userLetters.getOne({ where: { letterId: id } }));

    return [letter, letterIsUsed];
  }
}
