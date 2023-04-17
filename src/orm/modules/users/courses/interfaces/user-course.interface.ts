export interface IUserCourse {
  userId: number;
  courseId: number;
  isCompleted: boolean;
  courseStepId: number | null;
  courseStepExerciseId: number | null;
  exercisesCompletedToday: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UserCourseScopesMap = Record<string, never>;
