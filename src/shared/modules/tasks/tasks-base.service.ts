import { I18nContext } from 'nestjs-i18n';
import { TaskCategoryDto } from '../../../admin/modules/tasks/categories/dtos/task-category.dto';
import { TaskCategoriesService } from '../../../admin/modules/tasks/categories/task-categories.service';
import { TaskI18nDto } from '../../../admin/modules/tasks/dtos/task.dto';
import {
  TaskTypeDto,
  TaskTypeIncludeDto,
} from '../../../admin/modules/tasks/types/dtos/task-type.dto';
import { TaskTypesService } from '../../../admin/modules/tasks/types/task-types.service';
import { TaskCategoryName } from '../../../orm/modules/tasks/categories/interfaces/task-category.enum';
import { nullToUndefined } from '../../helpers/null-to-undefined.helper';
import { Lang } from '../../interfaces/lang.enum';
import { DataWithTypeDto, TaskErrorDto } from './dtos/task.dto';

type langWithCategory = { lang: Lang; categoryName: TaskCategoryName };

type TaskTypeDataMap = {
  [key: string]: {
    test?: (val: string) => boolean;
    msg?: string;
    replace?: null;
  };
};
export class TasksBaseService {
  constructor(
    protected taskTypesService: TaskTypesService,
    protected taskCategoriesService: TaskCategoriesService,
  ) {}

  private fileTypes = ['article', 'audio', 'video'];

  async validateContent(
    i18n: I18nContext,
    categoryName: TaskCategoryName,
    translation: TaskI18nDto,
  ): Promise<TaskErrorDto[]> {
    const data = await this.getData(i18n, categoryName);
    if (!data) {
      return [
        {
          lang: translation.lang,
          categoryName,
          nestingLevel: 1,
          msg: 'Ошибка при поиске категории задания',
        },
      ];
    }

    const { category, categories, taskTypes } = data;

    const { errors, dataTypesWithInclude } = this.validateByTaskCategoryScheme(
      categoryName,
      translation,
      category,
      1,
    );
    if (errors.length) {
      return errors;
    }

    const validateByTaskTypeSchemeErrors = dataTypesWithInclude
      .flat()
      .flatMap((data) =>
        this.validateByTaskTypeScheme(
          { lang: translation.lang, categoryName },
          data,
          taskTypes,
          categories,
          1,
        ),
      );
    if (validateByTaskTypeSchemeErrors.length) {
      return validateByTaskTypeSchemeErrors;
    }

    return [];
  }

  async getData(i18n: I18nContext, categoryName: TaskCategoryName) {
    const categories = await this.taskCategoriesService.getAll(i18n, {});
    const taskTypes = await this.taskTypesService.getAll(i18n);
    const category = categories.find(({ name }) => name === categoryName);

    if (!category) {
      return null;
    }

    return { category, categories, taskTypes };
  }

  public validateByTaskCategoryScheme(
    categoryName: TaskCategoryName,
    { lang, content }: TaskI18nDto,
    category: TaskCategoryDto,
    nestingLevel: number,
    isFileContent: boolean = false,
    fileType: string | null = null,
  ): { errors: TaskErrorDto[]; dataTypesWithInclude: DataWithTypeDto[] } {
    const errObj: TaskErrorDto = { lang, categoryName, nestingLevel };
    const errors: TaskErrorDto[] = [];
    const dataTypesWithInclude: DataWithTypeDto[] = [];

    const nestingError = this.checkNestingLevel(errObj, nestingLevel);
    if (nestingError) {
      errors.push(nestingError);
      return { errors, dataTypesWithInclude };
    }

    for (const dataType of content) {
      errObj.taskType = isFileContent ? nullToUndefined(fileType) : dataType.type;
      const taskType = category.taskTypes.find((taskType) => taskType.name === dataType.type);
      if (!taskType) {
        errors.push({
          ...errObj,
          taskTypeInclude: isFileContent ? dataType.type : undefined,
          msg: isFileContent
            ? 'Данный тип задания не найден в схеме выбранного include'
            : 'Данный тип задания нельзя использовать в выбранной категории',
        });
        continue;
      }

      const validateDataErrors = this.validateData(dataType, taskType, {
        ...errObj,
        taskTypeInclude: isFileContent ? dataType.type : undefined,
      });
      if (validateDataErrors.length) {
        errors.push(...validateDataErrors);
        continue;
      }

      if (dataType.include && dataType.include.length) {
        dataTypesWithInclude.push(dataType);
      }
    }

    for (const taskType of category.taskTypes) {
      errObj.taskType = isFileContent ? nullToUndefined(fileType) : taskType.name;
      if (taskType.required) {
        const dataType = content.find((dataType) => dataType.type === taskType.name);
        if (!dataType) {
          errors.push({
            ...errObj,
            taskTypeInclude: isFileContent ? taskType.name : undefined,
            msg: isFileContent
              ? 'Данный тип задания обязателен в include, а его нет'
              : 'Данный тип задания обязателен в выбранной категории, а его нет',
          });
          continue;
        }
      }
    }

    return { errors, dataTypesWithInclude };
  }

  public validateByTaskTypeScheme(
    { lang, categoryName }: langWithCategory,
    { type, data, include }: DataWithTypeDto,
    taskTypes: TaskTypeDto[],
    categories: TaskCategoryDto[],
    nestingLevel: number,
  ): TaskErrorDto[] {
    const taskType = taskTypes.find((taskType) => taskType.name === type);
    const errObj: TaskErrorDto = { lang, categoryName, taskType: taskType?.name, nestingLevel };
    const errors: TaskErrorDto[] = [];
    const dataTypesWithInclude: DataWithTypeDto[] = [];

    const nestingError = this.checkNestingLevel(errObj, nestingLevel);
    if (nestingError) {
      errors.push(nestingError);
      return errors;
    }

    if (!include) {
      errors.push({ ...errObj, msg: 'No include' });
      return errors;
    }

    if (!taskType) {
      errors.push({ ...errObj, msg: 'No taskType' });
      return errors;
    }

    for (const dataType of include) {
      errObj.taskTypeInclude = dataType.type;
      const taskTypeInclude = taskType.include.find(
        (taskTypeInclude) => taskTypeInclude.name === dataType.type,
      );
      if (!taskTypeInclude) {
        errors.push({
          ...errObj,
          msg: 'Данный тип задания не найден в схеме выбранного include',
        });
        continue;
      }

      const validateDataErrors = this.validateData(dataType, taskTypeInclude, errObj);
      if (validateDataErrors.length) {
        errors.push(...validateDataErrors);
        continue;
      }

      if (dataType.include && dataType.include.length) {
        dataTypesWithInclude.push(dataType);
      }
    }

    for (const taskTypeInclude of taskType.include) {
      errObj.taskTypeInclude = taskTypeInclude.name;
      if (taskTypeInclude.required) {
        const dataType = include.find((dataType) => dataType.type === taskTypeInclude.name);
        if (!dataType) {
          errors.push({
            ...errObj,
            msg: 'Данный тип задания обязателен в include, а его нет',
          });
          continue;
        }
      }
    }

    if (errors.length) {
      return errors;
    }

    if (type === 'file') {
      return this.validateFile(
        { lang, categoryName },
        { type, data, include },
        taskTypes,
        categories,
        nestingLevel,
      );
    }

    if (dataTypesWithInclude.length) {
      return dataTypesWithInclude.flatMap((dataType) =>
        this.validateByTaskTypeScheme(
          { lang, categoryName },
          dataType,
          taskTypes,
          categories,
          1 + nestingLevel,
        ),
      );
    }

    return [];
  }

  validateFile(
    { lang, categoryName }: langWithCategory,
    { type, include }: DataWithTypeDto,
    taskTypes: TaskTypeDto[],
    categories: TaskCategoryDto[],
    nestingLevel: number,
  ): TaskErrorDto[] {
    const taskType = taskTypes.find((taskType) => taskType.name === type);
    const errObj: TaskErrorDto = { lang, categoryName, taskType: taskType?.name, nestingLevel };
    const errors: TaskErrorDto[] = [];

    const nestingError = this.checkNestingLevel(errObj, nestingLevel);
    if (nestingError) {
      errors.push(nestingError);
      return errors;
    }

    if (!include) {
      errors.push({ ...errObj, msg: 'No include' });
      return errors;
    }

    const fileType = include.find((dataTypeInclude) => dataTypeInclude.type === 'file_type');
    if (!fileType) {
      errors.push({
        ...errObj,
        msg: `Тип file должен содержать file_type`,
      });
      return errors;
    }

    const fileContent = include.find((dataTypeInclude) => dataTypeInclude.type === 'file_content');
    if (!fileContent || !fileContent.include || !fileContent.include.length) {
      errors.push({
        ...errObj,
        msg: `Тип file должен содержать file_content вместе с include`,
      });
      return errors;
    }

    if (!fileType.data) {
      errors.push({ ...errObj, msg: 'No fileType.data' });
      return errors;
    }

    if (!this.fileTypes.includes(fileType.data)) {
      errors.push({
        ...errObj,
        taskTypeInclude: fileType.data,
        msg: `В file_type можно использовать только ${this.fileTypes.join(',')}`,
      });
      return errors;
    }

    const category = categories.find((category) => category.name === fileType.data);
    if (!category) {
      errors.push({ ...errObj, msg: 'No category' });
      return errors;
    }

    const validateRes = this.validateByTaskCategoryScheme(
      categoryName,
      { lang, content: fileContent.include },
      category,
      1 + nestingLevel,
      true,
      `file_type -> ${fileType.data}`,
    );

    if (validateRes.errors.length) {
      return validateRes.errors;
    }

    const validateByTaskTypeSchemeErrors = validateRes.dataTypesWithInclude
      .flat()
      .flatMap((data) =>
        this.validateByTaskTypeScheme(
          { lang, categoryName },
          data,
          taskTypes,
          categories,
          1 + nestingLevel,
        ),
      );
    if (validateByTaskTypeSchemeErrors.length) {
      return validateByTaskTypeSchemeErrors;
    }

    return [];
  }

  validateData(dataType: DataWithTypeDto, taskType: TaskTypeIncludeDto, errObj: TaskErrorDto) {
    const errors: TaskErrorDto[] = [];
    const errMsg = `Данный тип задания не может содержать введенных данных`;

    if (taskType.files && taskType.files.length) {
      if (!dataType.data) {
        errors.push({ ...errObj, msg: 'No dataType.data' });
        return errors;
      }

      try {
        const _url =
          dataType.data.startsWith('https://') || dataType.data.startsWith('http://')
            ? dataType.data
            : `https://${dataType.data}`;
        const url = new URL(_url);
        if (!url.pathname) throw '';
        const ext = url.pathname.split('.')[1];
        if (!ext || !taskType.files.includes(ext)) throw '';
      } catch (e) {
        errors.push({
          ...errObj,
          msg: `Данный тип задания должен содержать ссылку на файл с расширением: ${taskType.files.join(
            ',',
          )}`,
        });
        return errors;
      }
    }

    const taskData = this.taskTypeDataMap[taskType.name];
    if (!taskData) {
      return errors;
    }

    if (taskData.test) {
      if (!dataType.data || !taskData.test(dataType.data)) {
        errors.push({
          ...errObj,
          msg: taskData.msg || errMsg,
        });
        return errors;
      }
    }

    if (taskData.replace !== undefined) {
      if (taskData.replace === null) {
        delete dataType.data;
      } else {
        dataType.data = taskData.replace;
      }
    }

    return errors;
  }

  checkNestingLevel(errObj: TaskErrorDto, nestingLevel: number, maxLevel = 8): TaskErrorDto | null {
    // Допустимо:
    // |- dir
    //   |- dir
    //   |  |- dir
    //   |  |  |- file
    if (nestingLevel > maxLevel) {
      return {
        ...errObj,
        taskTypeInclude: undefined,
        msg: `Превышен максимальный уровень вложенности - ${maxLevel}`,
      };
    }
    return null;
  }

  private taskTypeDataMap: TaskTypeDataMap = {
    alpha: {
      replace: null,
    },
    title: {},
    description: {},
    html: {},
    input: {},
    progressbar: {
      test: (val: string) => /^\d+$/.test(val) && +val >= 0 && +val <= 100,
      msg: 'Данный тип задания должен содержать целое число от 0 до 100',
    },
    checkbox: {
      replace: null,
    },
    checked: {
      test: (val: string) => val === 'false' || val === 'true',
      msg: 'Данный тип задания должен содержать только значение true или false',
    },
    video: {
      test: (val: string) => {
        try {
          const url = new URL(val);
          if (
            !url.hostname ||
            !(url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be'))
          )
            throw '';
        } catch (e) {
          return false;
        }
        return true;
      },
      msg: 'Данный тип задания должен содержать только ссылку на youtube видео',
    },
    audio: {},
    image: {},
    card: {
      replace: null,
    },
    card_image: {},
    card_counter: {
      test: (val: string) => /^\d+$/.test(val) && +val > 0,
      msg: 'Данный тип задания должен содержать целое число, большее 0',
    },
    card_total: {
      test: (val: string) => /^\d+$/.test(val) && +val > 0,
      msg: 'Данный тип задания должен содержать целое число, большее 0',
    },
    card_timer: {
      test: (val: string) =>
        /^[0-5]?\d:[0-5]?\d$/.test(val) && !['0:0', '0:00', '00:0', '00:00'].includes(val),
      msg: 'Данный тип задания должен содержать время в формате MM:SS. От 00:01 до 59:59',
    },
    dir: {
      replace: null,
    },
    dir_image: {},
    dir_name: {},
    dir_content: {
      replace: null,
    },
    file: {
      replace: null,
    },
    file_type: {},
    file_image: {},
    file_name: {},
    file_content: {
      replace: null,
    },
    disabled: {
      test: (val: string) => val === 'false' || val === 'true',
      msg: 'Данный тип задания должен содержать только значение true или false',
    },
    timer: {
      test: (val: string) =>
        /^([01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d$/.test(val) &&
        ![
          '00:0:0',
          '00:00:0',
          '00:0:00',
          '00:00:00',
          '0:0:0',
          '0:00:0',
          '0:0:00',
          '0:00:00',
        ].includes(val),
      msg: 'Данный тип задания должен содержать время в формате HH:MM:SS. От 00:00:01 до 23:59:59',
    },
    btn_next_finish_screen: {
      test: (val: string) => val !== undefined && val !== '',
      msg: 'Данный тип задания должен содержать название кнопки',
    },
    btn_next_record_screen: {
      test: (val: string) => val !== undefined && val !== '',
      msg: 'Данный тип задания должен содержать название кнопки',
    },
    btn_finish: {
      test: (val: string) => val !== undefined && val !== '',
      msg: 'Данный тип задания должен содержать название кнопки',
    },
    btn_read_later: {
      test: (val: string) => val !== undefined && val !== '',
      msg: 'Данный тип задания должен содержать название кнопки',
    },
    btn_start: {
      test: (val: string) => val !== undefined && val !== '',
      msg: 'Данный тип задания должен содержать название кнопки',
    },
    btn_stop: {
      test: (val: string) => val !== undefined && val !== '',
      msg: 'Данный тип задания должен содержать название кнопки',
    },
    finish_screen: {
      replace: null,
    },
    record_screen: {
      replace: null,
    },
  } as const;
}
