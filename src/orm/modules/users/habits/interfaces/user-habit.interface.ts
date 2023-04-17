export interface IUserHabit {
  userId: number;
  habitId: number;
  time: string;
  isCompleted: boolean;
  isChallenge: boolean;
  daysRemaining: number;
  fromCourses: boolean;
  fromCelebrities: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserHabitScopesMap = Record<string, never>;
