import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  ILetter,
  LetterScopesMap,
} from '../../../../orm/modules/letters/interfaces/letter.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { UserLetterDto } from './dtos/user-letter.dto';

@Injectable()
export class UserLettersMapper {
  constructor(private i18n: I18nHelperService) {
    logClassName(this.constructor.name, __filename);
  }

  toUserLetterDto(
    i18nContext: I18nContext,
    { id, i18n }: BS<ILetter, LetterScopesMap, 'i18n'>,
  ): UserLetterDto {
    return {
      id,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      description: this.i18n.getValue(i18nContext, i18n, 'description'),
    };
  }
}
