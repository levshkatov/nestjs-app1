import { TaskCategoryName } from '../categories/interfaces/task-category.enum';

export interface TaskOrmGetAllAdmin {
  forHabits?: boolean;
  forExercises?: boolean;
  id?: number;
  name?: string;
  categoryName?: TaskCategoryName;
  notLinked?: boolean;
}
