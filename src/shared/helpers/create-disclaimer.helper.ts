import { I18nContext } from 'nestjs-i18n';
import disclaimers from '../../assets/i18n/ru/disclaimers.json';

export const createDisclaimer = (
  i18n: I18nContext,
  ...names: Translation<typeof disclaimers>[]
): string => `${names.map((name) => i18n.t(`disclaimers.${name}`)).join('.\n')}.`;
