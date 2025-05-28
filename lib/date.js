/**
 * ==========================================================================
 * Date Formatting Utilities
 * ==========================================================================
 */

/**
 * Formats a Date object into a string based on a format string.
 * Supports various tokens for year, month, day, hour, minute, second, and AM/PM.
 *
 * @param {Date} date - The date object to format.
 * @param {string} formatString - The string defining the output format.
 * @param {string} [locale='en-US'] - Optional locale for month/day names.
 * @returns {string} The formatted date string.
 */
export function formatDate(date, formatString, locale = "en-US") {
  if (!(date instanceof Date) || isNaN(date)) {
    return "Invalid Date";
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const ampm = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;

  const pad = (num, len = 2) => String(num).padStart(len, "0");

  const getMonthName = (format) =>
    new Intl.DateTimeFormat(locale, { month: format }).format(date);
  const getDayName = (format) =>
    new Intl.DateTimeFormat(locale, { weekday: format }).format(date);

  const replacements = {
    YYYY: year,
    YY: String(year).slice(-2),
    MMMM: getMonthName("long"),
    MMM: getMonthName("short"),
    MM: pad(month),
    M: month,
    DDDD: getDayName("long"),
    DDD: getDayName("short"),
    DD: pad(day),
    D: day,
    HH: pad(hours),
    H: hours,
    hh: pad(hours12),
    h: hours12,
    mm: pad(minutes),
    m: minutes,
    ss: pad(seconds),
    s: seconds,
    A: ampm.toUpperCase(),
    a: ampm.toLowerCase(),
  };

  let result = formatString;
  for (const token in replacements) {
    if (Object.prototype.hasOwnProperty.call(replacements, token)) {
      result = result.replace(new RegExp(token, "g"), replacements[token]);
    }
  }
  return result;
}

/**
 * Calculates the time elapsed since a given date and returns a human-readable string.
 * e.g., "5 minutes ago", "2 hours ago", "3 days ago".
 * @param {Date|string|number} dateInput - The past date. Can be a Date object, date string, or timestamp.
 * @param {string} [locale='en-US'] - Optional locale for relative time formatting.
 * @returns {string} Human-readable time difference.
 */
export function timeAgo(dateInput, locale = "en-US") {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

  if (seconds < 0) {
    return "in the future";
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (seconds < 60) {
    return rtf.format(-seconds, "second");
  }
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return rtf.format(-minutes, "minute");
  }
  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return rtf.format(-hours, "hour");
  }
  const days = Math.round(hours / 24);
  if (days < 7) {
    return rtf.format(-days, "day");
  }
  const weeks = Math.round(days / 7);
  if (weeks < 4.345) {
    return rtf.format(-weeks, "week");
  }
  const months = Math.round(days / 30.4375);
  if (months < 12) {
    return rtf.format(-months, "month");
  }
  const years = Math.round(days / 365.25);
  return rtf.format(-years, "year");
}

/**
 * Checks if a given date is today.
 * @param {Date} date - The date to check.
 * @returns {boolean} True if the date is today, false otherwise.
 */
export function isToday(date) {
  if (!(date instanceof Date) || isNaN(date)) return false;
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * Checks if a given date is yesterday.
 * @param {Date} date - The date to check.
 * @returns {boolean} True if the date is yesterday, false otherwise.
 */
export function isYesterday(date) {
  if (!(date instanceof Date) || isNaN(date)) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}