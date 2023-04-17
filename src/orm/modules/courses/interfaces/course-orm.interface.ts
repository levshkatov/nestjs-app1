import { CourseType } from './course-type.enum';

export interface CourseOrmGetAllAdmin {
  id?: number;
  disabled?: boolean;
  type?: CourseType;
  name?: string;
}
