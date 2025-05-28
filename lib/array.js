/**
 * ==========================================================================
 * Array Utilities
 * ==========================================================================
 */

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @template T
 * @param {T[]} array - The array to shuffle.
 * @returns {T[]} The shuffled array (mutated).
 */
export function shuffle(array) {
  if (!Array.isArray(array)) return [];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Creates a new array with unique values from the input array.
 * For arrays of primitives. For objects, it checks reference equality.
 * @template T
 * @param {T[]} array - The array to get unique values from.
 * @returns {T[]} A new array with unique values.
 */
export function unique(array) {
  if (!Array.isArray(array)) return [];
  return [...new Set(array)];
}

/**
 * Groups elements of an array based on a given key or a callback function.
 * @template T
 * @param {T[]} array - The array to group.
 * @param {string | ((item: T) => string | number)} keyOrFn - Property name or function to get the grouping key.
 * @returns {Object.<string, T[]>} An object where keys are group identifiers and values are arrays of elements.
 */
export function groupBy(array, keyOrFn) {
  if (!Array.isArray(array)) return {};
  return array.reduce((result, item) => {
    const key = typeof keyOrFn === "function" ? keyOrFn(item) : item[keyOrFn];
    (result[key] = result[key] || []).push(item);
    return result;
  }, {});
}