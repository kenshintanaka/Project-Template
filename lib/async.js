/**
 * ==========================================================================
 * Async Utilities
 * ==========================================================================
 */

/**
 * Debounces a function, delaying its execution until after a certain time has passed
 * since the last time it was invoked.
 * @template F
 * @param {F} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @param {boolean} [immediate=false] - If true, trigger the function on the leading edge instead of the trailing.
 * @returns {(...args: Parameters<F>) => void} The debounced function.
 */
export function debounce(func, delay, immediate = false) {
  let timeoutId;
  return function (...args) {
    const context = this;
    const later = function () {
      timeoutId = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeoutId;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(later, delay);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Throttles a function, ensuring it's called at most once within a specified time window.
 * @template F
 * @param {F} func - The function to throttle.
 * @param {number} limit - The time limit in milliseconds.
 * @returns {(...args: Parameters<F>) => void} The throttled function.
 */
export function throttle(func, limit) {
  let inThrottle;
  let lastFunc;
  let lastRan;
  return function (...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastFunc) {
          lastFunc.apply(context, args);
          lastRan = Date.now();
          lastFunc = null;
        }
      }, limit);
    } else {
      clearTimeout(lastFunc);
      lastFunc = () => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      };
    }
  };
}

/**
 * Returns a Promise that resolves after a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>}
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}