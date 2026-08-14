const UK_TIME_ZONE = "Europe/London";

/** Today's calendar date in the UK, as `YYYY-MM-DD`. */
export function getUkToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: UK_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function addCalendarDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return next.toISOString().slice(0, 10);
}

/** Saturday or Sunday for a `YYYY-MM-DD` calendar date. */
export function isWeekendDate(isoDate: string): boolean {
  const [year, month, day] = isoDate.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return weekday === 0 || weekday === 6;
}

export function nextWeekdayOnOrAfter(isoDate: string): string {
  let date = isoDate;
  while (isWeekendDate(date)) {
    date = addCalendarDays(date, 1);
  }
  return date;
}

export function previousWeekdayOnOrBefore(isoDate: string): string {
  let date = isoDate;
  while (isWeekendDate(date)) {
    date = addCalendarDays(date, -1);
  }
  return date;
}

/** Move by N weekdays, skipping Saturday and Sunday. */
export function addWeekdays(isoDate: string, days: number): string {
  if (days === 0) return isoDate;
  const step = days > 0 ? 1 : -1;
  let remaining = Math.abs(days);
  let date = isoDate;
  while (remaining > 0) {
    date = addCalendarDays(date, step);
    if (!isWeekendDate(date)) remaining -= 1;
  }
  return date;
}

/** Keep a date inside `[minDate, maxDate]` on a weekday. */
export function clampToWeekday(
  isoDate: string,
  minDate: string,
  maxDate: string
): string {
  let date = isoDate;
  if (date < minDate) date = minDate;
  if (date > maxDate) date = maxDate;
  if (!isWeekendDate(date)) return date;

  const next = nextWeekdayOnOrAfter(date);
  if (next <= maxDate) return next;
  return previousWeekdayOnOrBefore(date);
}

/** True if the instant falls on Saturday or Sunday in Europe/London. */
export function isUkWeekendInstant(isoDateTime: string): boolean {
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: UK_TIME_ZONE,
  }).format(new Date(isoDateTime));
  return weekday === "Sat" || weekday === "Sun";
}

export function formatUkCalendarDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
