import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../../pop-up/pop-up.service';
import { InterestingHelpsMapper } from './interesting-helps.mapper';
import { InterestingHelpDetailedDto, InterestingHelpForListDto } from './dtos/interesting-help.dto';
import { InterestingHelpOrmService } from '../../../../orm/modules/interesting/helps/interesting-help-orm.service';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';

@Injectable()
export class InterestingHelpsService {
  constructor(
    private popup: PopUpService,
    private helps: InterestingHelpOrmService,
    private helpsMapper: InterestingHelpsMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(i18n: I18nContext): Promise<InterestingHelpForListDto[]> {
    return (
      await this.helps.getAll({ where: { disabled: false }, order: [['id', 'ASC']] }, [
        'i18n',
        'photo',
      ])
    ).map((help) => this.helpsMapper.toInterestingHelpForListDto(i18n, help));
  }

  async getOne(i18n: I18nContext, id: number): Promise<InterestingHelpDetailedDto> {
    const help = await this.helps.getOneFromAll({ where: { id, disabled: false } }, [
      'i18n',
      'audio',
    ]);
    if (!help) {
      throw this.popup.error(i18n, `interesting.notFound`);
    }

    return this.helpsMapper.toInterestingHelpDetailedDto(i18n, help);
  }
}
