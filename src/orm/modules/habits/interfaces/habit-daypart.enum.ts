export enum HabitDaypart {
  morning = 'morning',
  day = 'day',
  evening = 'evening',
}

export const DAYPART_BOUNDARIES: Record<HabitDaypart, [string, string]> = {
  morning: ['06:00:00', '12:00:00'],
  day: ['11:00:00', '18:00:00'],
  evening: ['16:00:00', '24:00:00'],
};
