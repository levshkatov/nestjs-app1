import { I18nContext } from 'nestjs-i18n';
import { IMedia, MediaScopesMap } from '../../../orm/modules/media/interfaces/media.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { Lang } from '../../../shared/interfaces/lang.enum';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../media/media.mapper';
import { InterestingGroupByCategoryDto } from './dtos/interesting.dto';

interface IBase {
  id: number;
  categoryId: number;
  photo: BS<IMedia, MediaScopesMap, 'photoSizes'>;
  i18n: { title: string; lang: Lang }[];
  category: { i18n: { title: string; lang: Lang }[] };
}

export class InterestingMapper {
  constructor(protected i18n: I18nHelperService, protected mediaMapper: MediaMapper) {}

  protected groupByCategory<I extends IBase>(
    i18nContext: I18nContext,
    objects: I[],
  ): InterestingGroupByCategoryDto[] {
    const list: (InterestingGroupByCategoryDto & { id: number })[] = [];

    objects.forEach(({ id, categoryId, photo, i18n, category: { i18n: categoryI18n } }) => {
      const group = list.find(({ id }) => id === categoryId);
      if (!group) {
        list.push({
          id: categoryId,
          groupTitle: this.i18n.getValue(i18nContext, categoryI18n, 'title'),
          items: [
            {
              id,
              photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
              title: this.i18n.getValue(i18nContext, i18n, 'title'),
            },
          ],
        });
      } else {
        group.items.push({
          id,
          photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
          title: this.i18n.getValue(i18nContext, i18n, 'title'),
        });
      }
    });

    return list.map(({ groupTitle, items }) => ({ groupTitle, items }));
  }
}
