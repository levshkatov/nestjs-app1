import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../../main-orm.service';
import { CourseStep } from './course-step.model';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { CourseStepScopesMap } from './interfaces/course-step.interface';
import { Attributes, BulkCreateOptions, CreationAttributes, DestroyOptions } from 'sequelize';
import { CourseStepI18n } from './course-step-i18n.model';
import { CourseStepLetter } from './course-step-letter.model';

@Injectable()
export class CourseStepOrmService extends MainOrmService<CourseStep, CourseStepScopesMap> {
  constructor(
    @InjectModel(CourseStep)
    private courseStep: typeof CourseStep,

    @InjectModel(CourseStepI18n)
    private courseStepI18n: typeof CourseStepI18n,

    @InjectModel(CourseStepLetter)
    private courseStepLetter: typeof CourseStepLetter,
  ) {
    super(courseStep);
    logClassName(this.constructor.name, __filename);
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<CourseStepI18n>>,
    options?: BulkCreateOptions<Attributes<CourseStepI18n>>,
  ): Promise<Attributes<CourseStepI18n>[]> {
    return MainOrmService.bulkCreate(this.courseStepI18n, records, options);
  }

  async destroyI18n(options?: DestroyOptions<Attributes<CourseStepI18n>>): Promise<number> {
    return MainOrmService.destroy(this.courseStepI18n, options);
  }

  async createLetters(
    records: ReadonlyArray<CreationAttributes<CourseStepLetter>>,
    options?: BulkCreateOptions<Attributes<CourseStepLetter>>,
  ): Promise<Attributes<CourseStepLetter>[]> {
    return MainOrmService.bulkCreate(this.courseStepLetter, records, options);
  }

  async destroyLetters(options?: DestroyOptions<Attributes<CourseStepLetter>>): Promise<number> {
    return MainOrmService.destroy(this.courseStepLetter, options);
  }
}
