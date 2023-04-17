import { I18nContext } from 'nestjs-i18n';
import { ErrorDto } from '../dtos/responses.dto';
import common from '../../assets/i18n/ru/errors.json';

export type ErrorTitle = 'common' | 'get' | 'create' | 'edit' | 'delete';

/**
 * Translations must be in errors.e.%title% and errors.%errorName%
 */
export const createError = (
  i18n: I18nContext,
  title: ErrorTitle | keyof typeof common.e | null,
  errorName: Translation<typeof common> | null,
  errors?: string | string[],
) => {
  title = title || 'common';
  errorName = errorName || 'e.unknown';
  errors =
    errors && typeof errors === 'string' ? [errors] : errors && Array.isArray(errors) ? errors : [];

  return new ErrorDto({
    statusCode: 400,
    title: i18n.t(`errors.e.${title}`),
    errors: errors.length ? errors : [i18n.t(`errors.${errorName}`)],
  });
};
