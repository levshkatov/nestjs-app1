import { ButtonName } from './button-name.enum';

export interface PopUpI18n {
  title: string;
  description: string;
  buttons: { [key in ButtonName]: string };
}
