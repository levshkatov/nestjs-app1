import { HabitDaypart } from '../../habits/interfaces/habit-daypart.enum';

export interface ILotus {
  id: number;
  userId: number;
  daypart: HabitDaypart;
  createdAt: Date;
  updatedAt: Date;
}

export type LotusScopesMap = Record<string, never>;
