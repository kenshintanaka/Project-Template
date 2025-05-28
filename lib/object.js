/**
 * ==========================================================================
 * Object Utilities
 * ==========================================================================
 */

/**
 * Checks if an object is empty (has no own enumerable properties).
 * @param {object} obj - The object to check.
 * @returns {boolean} True if the object is empty, false otherwise.
 */
export function isEmptyObject(obj) {
  if (obj == null || typeof obj !== "object" || Array.isArray(obj)) {
    return true;
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

/**
 * Creates a deep clone of an object or array.
 * Handles nested objects, arrays, and dates. Does not handle functions or regexps correctly.
 * For more complex scenarios, consider a dedicated library.
 * @template T
 * @param {T} obj - The object or array to clone.
 * @returns {T} The deep cloned object or array.
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  const clonedObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
}