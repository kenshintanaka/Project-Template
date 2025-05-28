/**
 * ==========================================================================
 * Number Utilities
 * ==========================================================================
 */

/**
 * Generates a random integer between min (inclusive) and max (inclusive).
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random integer within the specified range.
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamps a number between a minimum and maximum value.
 * @param {number} value - The number to clamp.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} The clamped number.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Formats a number as currency.
 * @param {number} amount - The amount to format.
 * @param {string} [currency='USD'] - The currency code (e.g., 'EUR', 'JPY').
 * @param {string} [locale='en-US'] - The locale for formatting.
 * @returns {string} The formatted currency string.
 */
export function formatCurrency(amount, currency = "USD", locale = "en-US") {
  if (typeof amount !== "number") return "";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${amount.toFixed(2)} ${currency}`;
  }
}