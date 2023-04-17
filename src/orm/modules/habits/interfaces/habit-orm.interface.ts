import { TaskCategoryName } from '../../tasks/categories/interfaces/task-category.enum';
import { HabitDaypart } from './habit-daypart.enum';

export interface HabitOrmGetAllAdmin {
  id?: number;
  disabled?: boolean;
  categoryId?: number;
  taskId?: number;
  taskName?: string;
  taskCategoryName?: TaskCategoryName;
  name?: string;
  daypart?: HabitDaypart;
  tag?: string;
}
