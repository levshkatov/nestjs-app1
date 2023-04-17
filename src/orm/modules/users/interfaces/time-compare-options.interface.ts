export interface TimeCompareOptions {
  // SQL example:
  // WHERE date_trunc('minute', (timezone('utc', now()) + "offsetUTC"::interval)::time)
  // = "habits->UserHabit"."time"::time - '00:06'::interval;

  // Could be simple time without seconds - `00:00`
  // Or complex expression - `"habits->UserHabit"."time"`
  time: string;

  compareOperator?: '=' | '>=' | '<=' | '>' | '<';

  // Time offset in format `+-HH:MM`
  // example: `-00:04`
  offset?: string;
}
