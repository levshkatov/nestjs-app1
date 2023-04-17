const localeOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

interface NowFormatOptions {
  timestamp?: number;
  onlyDate?: boolean;
  onlyTime?: boolean;
  timeWithColon?: boolean;
}

/**
 * Returns timestamp in format date-time
 * @example: returns 20220718-130737
 * @example: returns 20220718 onlyDate: true
 * @example: returns 130737 onlyTime: true
 * @example: returns 20220718-13:07:37 timeWithColon: true
 */
export const nowFormatted = ({
  timestamp,
  onlyDate,
  onlyTime,
  timeWithColon,
}: NowFormatOptions = {}): string => {
  const now = (timestamp ? new Date(timestamp) : new Date()).toLocaleString('ru-ru', localeOptions);
  const date = now.split(',')[0]!.split('.').reverse().join('');
  let time = now.split(',')[1]!.trim();
  if (!timeWithColon) {
    time = time.split(':').join('');
  }
  return onlyDate ? date : onlyTime ? time : `${date}-${time}`;
};
