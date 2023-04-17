import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CommonConfig } from '../../../config/interfaces/common';
import { ErrorDto } from '../../dtos/responses.dto';
import { logClassName } from '../../helpers/log-classname.helper';
import { Lang } from '../../interfaces/lang.enum';

@Injectable()
export class I18nHelperService {
  private fallbackLang = Lang[this.config.get<CommonConfig>('common')!.fallbackLang];
  private supportedLangs = this.i18nService.getSupportedLanguages() as Lang[];

  constructor(private config: ConfigService, private i18nService: I18nService) {
    logClassName(this.constructor.name, __filename);
  }

  /**
   * @throws {ErrorDto}
   */
  checkFallbackLang<T extends { lang: Lang }>(i18n: I18nContext, translations: T[]): void {
    if (!translations.find(({ lang }) => lang === this.fallbackLang)) {
      throw new ErrorDto({
        statusCode: 400,
        title: i18n.t(`errors.e.translation`),
        errors: [
          i18n.t('errors.translations.noFallbackLang', {
            args: { fallbackLang: this.fallbackLang },
          }),
        ],
      });
    }
  }

  createTranslations<T extends { lang: Lang }, K extends Record<string, unknown>>(
    translations: T[],
    obj: K,
  ): (T & K)[] {
    return translations
      .filter(({ lang }) => this.supportedLangs.includes(lang))
      .filter((el, i, arr) => arr.findIndex((el2) => el2.lang === el.lang) === i)
      .map((el) => ({ ...el, ...obj }));
  }

  getLang(i18n: I18nContext): Lang {
    const legalLang = Lang[i18n.lang as keyof typeof Lang];
    return legalLang && this.supportedLangs.includes(legalLang) ? legalLang : this.fallbackLang;
  }

  /**
   * Search translation with request lang || fallbackLang
   * @returns translation[key] || defaultValue || ''
   */
  getValue<T extends { lang: Lang }, K extends keyof T>(
    i18n: I18nContext,
    translations: T[],
    key: K,
    defaultVal?: undefined,
  ): T[K] | '';
  getValue<T extends { lang: Lang }, K extends keyof T, D>(
    i18n: I18nContext,
    translations: T[],
    key: K,
    defaultVal: Exclude<D, undefined>,
  ): T[K] | D;
  getValue<T extends { lang: Lang }, K extends keyof T, D>(
    i18n: I18nContext,
    translations: T[],
    key: K,
    defaultVal?: D,
  ): T[K] | D | '' {
    // TODO uncomment when we add new lang
    // const lang = this.getLang(i18n);
    // let translation = translations.find((el) => el.lang === lang);
    // if (!translation) {
    //   translation = translations.find((el) => el.lang === this.fallbackLang);
    //   if (!translation) {
    //     throw new Error(
    //       i18n.t('errors.translations.noTranslation', {
    //         args: { lang },
    //       }),
    //     );
    //   }
    // }

    return this.getValueFallbackLang(translations, key, defaultVal);

    // const translation = translations.find((el) => el.lang === this.fallbackLang);
    // if (!translation) {
    //   throw new Error(
    //     i18n.t('errors.translations.noTranslation', {
    //       args: { lang: this.fallbackLang },
    //     }),
    //   );
    // }

    // return translation[key] !== undefined
    //   ? translation[key]
    //   : defaultVal === undefined
    //   ? ''
    //   : defaultVal;
  }

  getValueNoI18n<T extends { lang: Lang }, K extends keyof T, D>(
    lang: Lang,
    translations: T[],
    key: K,
    defaultVal?: D,
  ) {
    // TODO change when we add new lang
    return this.getValueFallbackLang(translations, key, defaultVal);
  }

  getValueFallbackLang<T extends { lang: Lang }, K extends keyof T, D>(
    translations: T[],
    key: K,
    defaultVal?: D,
  ): T[K] | D | '' {
    const translation = translations.find((el) => el.lang === this.fallbackLang);
    if (!translation) {
      throw new Error('Translation error');
    }

    return translation[key] !== undefined
      ? translation[key]
      : defaultVal === undefined
      ? ''
      : defaultVal;
  }

  // LEGACY
  // /**
  //  * @example returns { method: ['i18n', langs] }
  //  */
  // scope<Map, ScopeName extends Extract<keyof Map, string>>(
  //   { lang }: I18nContext,
  //   scopeNames: ScopeName[],
  //   searchOptions?: Record<string, string>,
  // ): IScopeOption<ScopeName>[] {
  //   const langs: Lang[] = [];
  //   const legalLang = Lang[lang as keyof typeof Lang];
  //   if (legalLang) {
  //     langs.push(legalLang);
  //   }
  //   if (legalLang !== this.fallbackLang) {
  //     langs.push(this.fallbackLang);
  //   }

  //   const whereOptions: WhereOptions[] = [];
  //   if (searchOptions) {
  //     Object.keys(searchOptions).forEach((key) =>
  //       whereOptions.push({ [key]: { [Op.iLike]: `%${searchOptions[key]}%` } }),
  //     );
  //   }

  //   const scopeOptions: IScopeOption<ScopeName>[] = scopeNames.map((scopeName) => ({
  //     method: whereOptions.length ? [scopeName, langs, whereOptions] : [scopeName, langs],
  //   }));

  //   return scopeOptions;
  // }

  // LEGACY Test function for renaming property
  // createTranslations<
  //   T extends { id?: number; lang: Lang },
  //   K extends string,
  //   U extends Omit<T, 'id'> & Record<K, number>,
  // >(translations: T[], renameId: K): U[] {
  //   return translations
  //     .filter(({ lang }) => this.supportedLangs.includes(lang))
  //     .filter((el, i, arr) => arr.findIndex((el2) => el2.lang === el.lang) === i)
  //     .map((el) => {
  //       const newEl = {} as U;
  //       delete Object.assign(newEl, el, { [renameId]: el.id }).id;
  //       return newEl;
  //     });
  // }
}
