import { addDays, format, isWeekend, parse } from "date-fns";

const UK_TIME_ZONE = "Europe/London";
const ISO_DATE = "yyyy-MM-dd";

/** Parse a `YYYY-MM-DD` value as a local calendar date (no UTC shift). */
export function parseDateOnly(isoDate: string): Date {
  return parse(isoDate, ISO_DATE, new Date());
}

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
  return format(addDays(parseDateOnly(isoDate), days), ISO_DATE);
}

/** Saturday or Sunday for a `YYYY-MM-DD` calendar date. */
export function isWeekendDate(isoDate: string): boolean {
  return isWeekend(parseDateOnly(isoDate));
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
  return format(parseDateOnly(isoDate), "EEEE d MMMM yyyy");
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
