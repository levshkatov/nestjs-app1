import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { ButtonDto } from './dtos/button.dto';
import { PopUpDto } from './dtos/pop-up.dto';
import { ButtonName } from './interfaces/button-name.enum';
import { PopUpI18n } from './interfaces/pop-up-i18n.interface';
import { PopUpType } from './interfaces/pop-up-type.enum';
import popUps from '../../../assets/i18n/ru/pop-ups.json';

@Injectable()
export class PopUpService {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }

  create(type: PopUpType, translation: PopUpI18n | string, errors?: string[]): PopUpDto {
    if (typeof translation === 'string') {
      return new PopUpDto({ errors: [translation] });
    }

    const { title, description, buttons }: PopUpI18n = translation;
    if (!title || !description || !buttons || typeof buttons !== 'object') {
      return new PopUpDto({
        errors: [`!title || !description || !buttons || typeof buttons !== 'object'`],
      });
    }

    const options: PopUpDto = {
      type,
      title,
      description,
      buttons: this.createButtons(buttons),
      errors: errors || [],
    };

    return new PopUpDto(options);
  }

  error(i18n: I18nContext, key: Translation<typeof popUps>, errors?: string[]): PopUpDto {
    return this.create(PopUpType.error, i18n.translate(`pop-ups.${key}`), errors);
  }

  ok(i18n: I18nContext, key: Translation<typeof popUps>, errors?: string[]): PopUpDto {
    return this.create(PopUpType.ok, i18n.translate(`pop-ups.${key}`), errors);
  }

  question(i18n: I18nContext, key: Translation<typeof popUps>, errors?: string[]): PopUpDto {
    return this.create(PopUpType.question, i18n.translate(`pop-ups.${key}`), errors);
  }

  private createButtons(buttons: { [key in ButtonName]: string }): ButtonDto[] {
    const buttonDtos: ButtonDto[] = [];

    Object.entries(buttons).forEach(([name, text]) => {
      if (ButtonName[name as keyof typeof ButtonName]) {
        buttonDtos.push(new ButtonDto({ name: ButtonName[name as keyof typeof ButtonName], text }));
      }
    });

    if (!buttonDtos.length) {
      return [new ButtonDto({})];
    }

    return buttonDtos;
  }
}
