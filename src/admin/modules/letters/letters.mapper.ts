import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ILetterI18n } from '../../../orm/modules/letters/interfaces/letter-i18n.interface';
import { ILetter, LetterScopesMap } from '../../../orm/modules/letters/interfaces/letter.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { ObjectLinkedDto } from '../../shared/dtos/object-linked.dto';
import { LinkedObjectsMapper } from '../linked-objects.mapper';
import { LetterDetailedDto, LetterI18nDto, LetterForListDto } from './dtos/letter.dto';

@Injectable()
export class LettersMapper {
  constructor(private i18n: I18nHelperService, private linkedMapper: LinkedObjectsMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toLetterForListDto(
    i18nContext: I18nContext,
    {
      id,
      trigger,
      i18n,
      courseStepLetters,
    }: BS<ILetter, LetterScopesMap, 'courseStepLetters' | 'i18nSearch'>,
  ): LetterForListDto {
    const linked: ObjectLinkedDto[] = [];
    linked.push(
      ...courseStepLetters.map(({ courseStep }) =>
        this.linkedMapper.toCourseStepLinkedDto(i18nContext, courseStep, true),
      ),
    );

    return {
      id,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      trigger,
      linked,
    };
  }

  toLetterDetailedDto(
    i18nContext: I18nContext,
    {
      id,
      trigger,
      i18n,
      courseStepLetters,
    }: BS<ILetter, LetterScopesMap, 'courseStepLetters' | 'i18n'>,
    disclaimer?: string,
  ): LetterDetailedDto {
    const linked: ObjectLinkedDto[] = [];
    linked.push(
      ...courseStepLetters.map(({ courseStep }) =>
        this.linkedMapper.toCourseStepLinkedDto(i18nContext, courseStep, true),
      ),
    );

    return {
      disclaimer,
      id,
      trigger,
      translations: i18n.map((el) => this.toLetterI18nDto(i18nContext, el)),
      linked,
    };
  }

  toLetterI18nDto(
    i18nContext: I18nContext,
    { lang, name, description }: ILetterI18n,
  ): LetterI18nDto {
    return {
      lang,
      name,
      description,
    };
  }
}
