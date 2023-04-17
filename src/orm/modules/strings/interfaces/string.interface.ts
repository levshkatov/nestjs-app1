import { IStringI18n } from './string-i18n.interface';

export interface IString {
  name: string;
  screenName: string | null;
  createdAt: Date;
  updatedAt: Date;

  i18n?: IStringI18n[];
}

export type StringScopesMap = {
  i18n: ['i18n', undefined];
};
