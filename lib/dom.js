/**
 * ==========================================================================
 * DOM Utilities
 * ==========================================================================
 */

/**
 * Alias for document.querySelector
 * @param {string} selector - CSS selector
 * @param {Document|Element} [parent=document] - Parent element to search within
 * @returns {Element|null}
 */
export const qs = (selector, parent = document) =>
  parent.querySelector(selector);

/**
 * Alias for document.querySelectorAll
 * @param {string} selector - CSS selector
 * @param {Document|Element} [parent=document] - Parent element to search within
 * @returns {NodeListOf<Element>}
 */
export const qsa = (selector, parent = document) =>
  parent.querySelectorAll(selector);

/**
 * Adds an event listener to an element.
 * @param {Element|Window|Document} element - The element to attach the event to.
 * @param {string} event - The event name (e.g., 'click').
 * @param {Function} handler - The event handler function.
 * @param {object|boolean} [options] - Optional event listener options or useCapture flag.
 * @returns {() => void} Function to remove the event listener.
 */
export const on = (element, event, handler, options) => {
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
};

/**
 * Removes an event listener from an element.
 * @param {Element|Window|Document} element - The element to remove the event from.
 * @param {string} event - The event name (e.g., 'click').
 * @param {Function} handler - The event handler function.
 * @param {object|boolean} [options] - Optional event listener options or useCapture flag.
 */
export const off = (element, event, handler, options) => {
  element.removeEventListener(event, handler, options);
};

/**
 * Adds a class to an element.
 * @param {Element} element - The DOM element.
 * @param {string} className - The class name to add.
 */
export function addClass(element, className) {
  if (element && typeof className === "string") {
    element.classList.add(...className.trim().split(/\s+/));
  }
}

/**
 * Removes a class from an element.
 * @param {Element} element - The DOM element.
 * @param {string} className - The class name to remove.
 */
export function removeClass(element, className) {
  if (element && typeof className === "string") {
    element.classList.remove(...className.trim().split(/\s+/));
  }
}

/**
 * Toggles a class on an element.
 * @param {Element} element - The DOM element.
 * @param {string} className - The class name to toggle.
 * @param {boolean} [force] - Optional boolean to force add or remove the class.
 * @returns {boolean | undefined} The value of classList.toggle if successful.
 */
export function toggleClass(element, className, force) {
  if (element && typeof className === "string") {
    if (className.trim().split(/\s+/).length > 1) {
      console.warn(
        "toggleClass ideally handles one class at a time for predictable return value. For multiple classes, consider addClass/removeClass."
      );
      className
        .trim()
        .split(/\s+/)
        .forEach((cls) => element.classList.toggle(cls, force));
      return undefined;
    }
    return element.classList.toggle(className, force);
  }
  return undefined;
}

/**
 * Checks if an element has a specific class.
 * @param {Element} element - The DOM element.
 * @param {string} className - The class name to check for.
 * @returns {boolean} True if the element has the class, false otherwise.
 */
export function hasClass(element, className) {
  return element && typeof className === "string"
    ? element.classList.contains(className)
    : false;
}

/**
 * Sets CSS styles for an element.
 * @param {HTMLElement} element - The DOM element.
 * @param {object} styles - An object where keys are CSS property names (camelCase or kebab-case) and values are the property values.
 */
export function setStyle(element, styles) {
  if (element && typeof styles === "object") {
    Object.keys(styles).forEach((key) => {
      element.style[key] = styles[key];
    });
  }
}

/**
 * Creates a DOM element with specified tag, attributes, and children.
 * @param {string} tagName - The tag name for the element (e.g., 'div', 'span').
 * @param {object} [attributes={}] - An object of attributes to set on the element.
 * @param {(string|Node|Array<string|Node>)} [children=[]] - Content to append to the element (text, other elements, or an array).
 * @returns {HTMLElement} The created DOM element.
 */
export function createEl(tagName, attributes = {}, children = []) {
  const el = document.createElement(tagName);
  for (const key in attributes) {
    if (Object.prototype.hasOwnProperty.call(attributes, key)) {
      el.setAttribute(key, attributes[key]);
    }
  }
  const appendChild = (child) => {
    if (typeof child === "string") {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  };
  if (Array.isArray(children)) {
    children.forEach(appendChild);
  } else {
    appendChild(children);
  }
  return el;
}