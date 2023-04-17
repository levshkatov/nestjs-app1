import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { UserCourseScopesMap } from './interfaces/user-course.interface';
import { UserCourse } from './user-course.model';

@Injectable()
export class UserCourseOrmService extends MainOrmService<UserCourse, UserCourseScopesMap> {
  constructor(@InjectModel(UserCourse) private userCourse: typeof UserCourse) {
    super(userCourse);
    logClassName(this.constructor.name, __filename);
  }
}
