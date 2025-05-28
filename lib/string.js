/**
 * ==========================================================================
 * String Utilities
 * ==========================================================================
 */

/**
 * Capitalizes the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (typeof str !== "string" || str.length === 0) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a string to a URL-friendly slug.
 * Replaces spaces and non-alphanumeric characters with hyphens.
 * @param {string} str - The string to slugify.
 * @returns {string} The slugified string.
 */
export function slugify(str) {
  if (typeof str !== "string" || str.length === 0) {
    return "";
  }
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Truncates a string to a specified length and appends a suffix.
 * @param {string} str - The string to truncate.
 * @param {number} maxLength - The maximum length of the string (including suffix).
 * @param {string} [suffix='...'] - The suffix to append if truncated.
 * @returns {string} The truncated string or original string if shorter than maxLength.
 */
export function truncate(str, maxLength, suffix = "...") {
  if (typeof str !== "string" || str.length === 0) {
    return "";
  }
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Escapes HTML special characters in a string.
 * @param {string} str - The string to escape.
 * @returns {string} The HTML-escaped string.
 */
export function escapeHTML(str) {
  if (typeof str !== "string") {
    return "";
  }
  return str.replace(
    /[&<>"']/g,
    (match) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[match])
  );
}

/**
 * Generates a random string of a specified length.
 * @param {number} length - The desired length of the random string.
 * @param {string} [charset="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"] - Characters to use.
 * @returns {string} The generated random string.
 */
export function generateRandomString(
  length,
  charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
) {
  let result = "";
  const charsetLength = charset.length;
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charsetLength));
  }
  return result;
}