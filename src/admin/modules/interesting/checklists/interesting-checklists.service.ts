import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { InterestingCategoryType } from '../../../../orm/modules/interesting/categories/interfaces/interesting-category-type.enum';
import { InterestingChecklistOrmService } from '../../../../orm/modules/interesting/checklists/interesting-checklist-orm.service';
import { IInterestingChecklist } from '../../../../orm/modules/interesting/checklists/interfaces/interesting-checklist.interface';
import { MediaType } from '../../../../orm/modules/media/interfaces/media-type.enum';
import { MediaOrmService } from '../../../../orm/modules/media/media-orm.service';
import { TaskCategoryName } from '../../../../orm/modules/tasks/categories/interfaces/task-category.enum';
import { UserInterestingChecklistDataOrmService } from '../../../../orm/modules/users/interesting-checklist-datas/user-interesting-checklist-data-orm.service';
import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import { OkDto } from '../../../../shared/dtos/responses.dto';
import { createDisclaimer } from '../../../../shared/helpers/create-disclaimer.helper';
import { createError } from '../../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../../shared/interfaces/paginated.interface';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { InterestingService } from '../interesting.service';
import {
  InterestingChecklistsForListDto,
  InterestingChecklistCreateReqDto,
  InterestingChecklistDetailedDto,
  InterestingChecklistEditReqDto,
  InterestingChecklistsReqDto,
} from './dtos/interesting-checklist.dto';
import { InterestingChecklistsMapper } from './interesting-checklists.mapper';

@Injectable()
export class InterestingChecklistsService {
  constructor(
    private i18n: I18nHelperService,
    private checklists: InterestingChecklistOrmService,
    private checklistsMapper: InterestingChecklistsMapper,
    private media: MediaOrmService,
    private interesting: InterestingService,
    private userData: UserInterestingChecklistDataOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    { limit, offset }: Pagination,
  ): Promise<InterestingChecklistsForListDto> {
    const {
      pages,
      total,
      rows: checklists,
    } = await this.checklists.getAllAndCount(
      {
        offset,
        limit,
        order: [['id', 'DESC']],
      },
      ['i18n', 'photo', 'taskSimple', 'category'],
      `"InterestingChecklist"."id"`,
    );

    return {
      pages,
      total,
      interestingChecklists: checklists.map((checklist) =>
        this.checklistsMapper.toInterestingChecklistForListDto(i18n, checklist),
      ),
      disclaimer: createDisclaimer(i18n, 'checklists.forbiddenIfUsed'),
    };
  }

  async create(
    i18n: I18nContext,
    { categoryId, photoId, taskId, translations }: InterestingChecklistCreateReqDto,
  ): Promise<OkDto> {
    this.i18n.checkFallbackLang(i18n, translations);

    if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
      throw createError(i18n, 'create', 'media.photoNotFound');
    }

    await this.interesting.checkTask(i18n, 'create', taskId, TaskCategoryName.checklist);
    await this.interesting.checkCategory(
      i18n,
      'create',
      categoryId,
      InterestingCategoryType.checklist,
    );

    const checklist = await this.checklists.create({ disabled: true, photoId, taskId, categoryId });

    await this.checklists.createI18n(
      this.i18n.createTranslations(translations, { interestingChecklistId: checklist.id }),
    );

    return new OkDto();
  }

  async getOne(i18n: I18nContext, id: number): Promise<InterestingChecklistDetailedDto> {
    const checklist = await this.checklists.getOneFromAll({ where: { id } }, [
      'i18n',
      'photo',
      'taskSimple',
      'category',
    ]);
    if (!checklist) {
      throw createError(i18n, 'get', 'interesting.notFound');
    }

    const checklistIsUsed = !!(await this.userData.getOne({
      where: { interestingChecklistId: id },
    }));

    return this.checklistsMapper.toInterestingChecklistDetailedDto(
      i18n,
      checklist,
      checklistIsUsed
        ? createDisclaimer(i18n, 'checklists.isUsed', 'checklists.forbiddenIfUsed')
        : undefined,
    );
  }

  async edit(
    i18n: I18nContext,
    id: number,
    { categoryId, photoId, taskId, translations, disabled }: InterestingChecklistEditReqDto,
    { role }: IJWTUser,
  ): Promise<OkDto> {
    const checklist = await this.checklists.getOneFromAll({ where: { id } });
    if (!checklist) {
      throw createError(i18n, 'edit', 'interesting.notFound');
    }

    const isUsed = !!(await this.userData.getOne({ where: { interestingChecklistId: id } }));

    this.i18n.checkFallbackLang(i18n, translations);

    const checklistUpdate: Partial<GetRequired<IInterestingChecklist>> = {};

    if (photoId !== checklist.photoId) {
      if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
        throw createError(i18n, 'edit', 'media.photoNotFound');
      }
      checklistUpdate.photoId = photoId;
    }

    if (taskId !== checklist.taskId) {
      if (isUsed) {
        throw createError(i18n, 'edit', 'interesting.checklistIsUsed');
      }
      await this.interesting.checkTask(i18n, 'edit', taskId, TaskCategoryName.checklist);
      checklistUpdate.taskId = taskId;
    }

    if (categoryId !== checklist.categoryId) {
      await this.interesting.checkCategory(
        i18n,
        'edit',
        categoryId,
        InterestingCategoryType.checklist,
      );
      checklistUpdate.categoryId = categoryId;
    }

    if (disabled !== undefined && disabled !== checklist.disabled && role === UserRole.webAdmin) {
      if (disabled === true) {
        if (isUsed) {
          throw createError(i18n, 'edit', 'interesting.checklistIsUsed');
        }
      }
      checklistUpdate.disabled = disabled;
    }

    if (Object.keys(checklistUpdate).length) {
      await this.checklists.update(checklistUpdate, { where: { id } });
    }

    await this.checklists.destroyI18n({ where: { interestingChecklistId: id } });
    await this.checklists.createI18n(
      this.i18n.createTranslations(translations, { interestingChecklistId: id }),
    );

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    if (!!(await this.userData.getOne({ where: { interestingChecklistId: id } }))) {
      throw createError(i18n, 'delete', 'interesting.checklistIsUsed');
    }

    if ((await this.checklists.destroy({ where: { id } })) !== 1) {
      throw createError(i18n, 'delete', 'interesting.notFound');
    }
    return new OkDto();
  }
}
