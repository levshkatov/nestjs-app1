import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  IInterestingChecklist,
  InterestingChecklistScopesMap,
} from '../../../../orm/modules/interesting/checklists/interfaces/interesting-checklist.interface';
import { ITaskContent } from '../../../../orm/modules/tasks/interfaces/task-i18n.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../../media/media.mapper';
import { TasksMapper } from '../../tasks/tasks.mapper';
import { InterestingMapper } from '../interesting.mapper';
import {
  InterestingChecklistDetailedDto,
  InterestingChecklistGroupByCategoryDto,
} from './dtos/interesting-checklist.dto';

@Injectable()
export class InterestingChecklistsMapper extends InterestingMapper {
  constructor(i18n: I18nHelperService, mediaMapper: MediaMapper, private tasksMapper: TasksMapper) {
    super(i18n, mediaMapper);
    logClassName(this.constructor.name, __filename);
  }

  toInterestingChecklistListDto(
    i18nContext: I18nContext,
    checklists: BS<
      IInterestingChecklist,
      InterestingChecklistScopesMap,
      'i18n' | 'photo' | 'category'
    >[],
  ): InterestingChecklistGroupByCategoryDto[] {
    return this.groupByCategory(i18nContext, checklists);
  }

  toInterestingChecklistDetailedDto(
    i18nContext: I18nContext,
    {
      id: interestingChecklistId,
      task,
    }: BS<IInterestingChecklist, InterestingChecklistScopesMap, 'task'>,
    changeContent?: ITaskContent[],
  ): InterestingChecklistDetailedDto {
    if (changeContent?.length) {
      return {
        interestingChecklistId,
        task: {
          id: task.id,
          name: task.name,
          category: task.categoryName,
          content: changeContent,
        },
      };
    }

    return {
      interestingChecklistId,
      task: this.tasksMapper.toTaskDto(i18nContext, task),
    };
  }
}
