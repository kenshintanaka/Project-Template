/**
 * ==========================================================================
 * Web Component Utilities
 * ==========================================================================
 */

import { createState } from "./state.js";
import { qs, qsa, on } from "./dom.js";

// Helper to convert attribute names (kebab-case) to prop names (camelCase)
function kebabToCamel(str) {
  return str.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());
}

// Helper to convert prop names (camelCase) to attribute names (kebab-case)
function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// Helper for props type conversion from attribute string
function convertAttributeValue(value, type) {
  if (value === null) {
    if (type === Boolean) return false;
    return undefined;
  }
  if (type === Boolean) return true;
  if (type === Number) return parseFloat(value);
  if (type === String) return String(value);
  if (type === Array || type === Object) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn(
        `WebComponent (SC): Could not parse attribute value "${value}" as ${type.name}.`,
        e
      );
      return type === Array ? [] : {};
    }
  }
  return value;
}

// Module-level cache for the global Tailwind stylesheet
let _globalTailwindSheet = null;
let _globalTailwindSheetPromise = null;

async function _fetchAndCacheGlobalStyles(url) {
  if (_globalTailwindSheet) return _globalTailwindSheet;
  if (!_globalTailwindSheetPromise) {
    _globalTailwindSheetPromise = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for ${url}`);
        }
        return response.text();
      })
      .then(async (cssText) => {
        // Marked async as sheet.replace is async
        const sheet = new CSSStyleSheet();
        try {
          await sheet.replace(cssText); // .replace() is async
          _globalTailwindSheet = sheet;
          return sheet;
        } catch (e) {
          console.error(
            `WebComponent (SC): Error constructing CSSStyleSheet from global CSS (${url}).`,
            e
          );
          throw e; // Re-throw to be caught by the caller
        }
      })
      .catch((e) => {
        console.error(
          `WebComponent (SC): Failed to fetch or adopt global stylesheet from ${url}. Tailwind classes inside Shadow DOM might not work.`,
          e
        );
        _globalTailwindSheetPromise = null; // Allow retry on next component definition
        return null;
      });
  }
  return _globalTailwindSheetPromise;
}

/**
 * Defines a custom web component with a simplified syntax for Sobbing Cat's project.
 * All component tagNames for this project should start with "sc-" (e.g., "sc-my-element").
 *
 * @param {string} tagName - The name for the custom element (must include a hyphen and ideally start with "sc-").
 * @param {object} options - Configuration options for the component.
 * @param {string | ((state: object, props: object) => string)} [options.template=''] - HTML template string or a function returning it.
 * @param {string | ((state: object, props: object) => string)} [options.styles=''] - Component-specific CSS styles string or a function returning it.
 * @param {string} [options.tailwindGlobalCssUrl] - URL to the global Tailwind CSS file (e.g., '/css/output.css'). If provided, these styles will be adopted.
 * @param {object} [options.props={}] - Definitions for component properties and their corresponding attributes.
 * @param {object | ((initialProps: object) => object)} [options.initialState={}] - Initial state for the component.
 * @param {object} [options.methods={}] - Methods to be added to the component instance.
 * @param {object} [options.eventDelegation={}] - Declarative event listeners.
 * @param {(instance: HTMLElement) => void} [options.onConnect] - Called when the component is connected to the DOM.
 * @param {(instance: HTMLElement) => void} [options.onDisconnect] - Called when the component is disconnected from the DOM.
 * @param {(instance: HTMLElement, propName: string, oldValue: any, newValue: any) => void | boolean} [options.onPropsChange] - Called when a defined prop changes. Return false to prevent default render.
 * @param {boolean} [options.useShadowDOM=true] - Whether to use Shadow DOM for encapsulation.
 * @returns {CustomElementConstructor | undefined} The component class, or undefined if registration failed.
 */
export function defineComponent(tagName, options = {}) {
  const {
    template = () => "",
    styles: stylesOption = "", // Renamed to avoid conflict with HTMLElement.styles
    tailwindGlobalCssUrl,
    props: propDefinitions = {},
    initialState: initialStateOption = {},
    methods = {},
    eventDelegation = {},
    onConnect,
    onDisconnect,
    onPropsChange,
    useShadowDOM = true,
  } = options;

  if (typeof tagName !== "string" || !tagName.includes("-")) {
    console.error(
      `WebComponent (SC): tagName must be a string and include a hyphen (-). Provided: "${tagName}"`
    );
    return;
  }
  if (!tagName.startsWith("sc-")) {
    console.warn(
      `WebComponent (SC): tagName "${tagName}" does not start with the recommended "sc-" prefix for this project.`
    );
  }

  if (customElements.get(tagName)) {
    console.warn(
      `WebComponent (SC): Custom element "${tagName}" is already defined. Skipping redefinition.`
    );
    return customElements.get(tagName);
  }

  class Component extends HTMLElement {
    // ... (static observedAttributes, constructor, prop definitions, lifecycle methods like connectedCallback, disconnectedCallback, attributeChangedCallback, _handlePropChange remain largely the same as previous version)
    static get observedAttributes() {
      return Object.keys(propDefinitions).map((propName) =>
        camelToKebab(propName)
      );
    }

    constructor() {
      super();
      this._props = {};
      this._methods = {};
      this._eventCleanupFns = [];
      this._connected = false;
      this._stateInitialized = false;
      this._stateUnsubscribe = null;

      if (useShadowDOM) {
        this.attachShadow({ mode: "open" });
      }
      this._root = useShadowDOM ? this.shadowRoot : this;

      for (const propName in propDefinitions) {
        const definition = propDefinitions[propName];
        let defaultValue;
        if (
          typeof definition === "object" &&
          definition !== null &&
          definition.hasOwnProperty("default")
        ) {
          defaultValue =
            typeof definition.default === "function"
              ? definition.default()
              : definition.default;
        } else if (definition === Boolean) defaultValue = false;
        this._props[propName] = defaultValue;
      }

      for (const methodName in methods) {
        if (typeof methods[methodName] === "function") {
          this._methods[methodName] = methods[methodName].bind(this);
          if (!this[methodName]) this[methodName] = this._methods[methodName];
        }
      }

      Object.keys(propDefinitions).forEach((propName) => {
        Object.defineProperty(this, propName, {
          get: () => this._props[propName],
          set: (value) => {
            const oldValue = this._props[propName];
            if (oldValue === value && typeof value !== "object") return;
            this._props[propName] = value;
            const definition = propDefinitions[propName];
            if (
              definition &&
              typeof definition === "object" &&
              definition.reflects
            ) {
              const attrName = camelToKebab(propName);
              if (
                value === null ||
                value === undefined ||
                (typeof value === "boolean" && !value)
              )
                this.removeAttribute(attrName);
              else this.setAttribute(attrName, String(value));
            }
            if (this._connected)
              this._handlePropChange(propName, oldValue, value);
          },
          enumerable: true,
          configurable: true,
        });
      });
    }

    async _applyStyles() {
      if (
        !this._root ||
        !this._connected ||
        !useShadowDOM ||
        typeof CSSStyleSheet === "undefined" ||
        !this._root.adoptedStyleSheets === undefined
      ) {
        // Fallback or skip if Shadow DOM is not used or adoptedStyleSheets not supported
        if (
          !useShadowDOM &&
          typeof stylesOption === "string" &&
          stylesOption.trim() !== ""
        ) {
          // For light DOM, inject component-specific styles into document head or as a style tag if not already present.
          // This is complex to manage globally; users might prefer global CSS for light DOM components.
          console.warn(
            `WebComponent (SC): Component-specific 'styles' for light DOM component ${tagName} should ideally be handled globally or via direct <style> tags in template.`
          );
        }
        return;
      }

      const sheetsToAdopt = [];

      // 1. Global Tailwind styles (if URL provided)
      if (tailwindGlobalCssUrl) {
        const globalSheet = await _fetchAndCacheGlobalStyles(
          tailwindGlobalCssUrl
        );
        if (globalSheet) {
          sheetsToAdopt.push(globalSheet);
        }
      }

      // 2. Component-specific styles
      const componentSpecificStylesContent =
        typeof stylesOption === "function"
          ? stylesOption(this.getState ? this.getState() : {}, this._props)
          : stylesOption;

      if (
        componentSpecificStylesContent &&
        typeof componentSpecificStylesContent === "string" &&
        componentSpecificStylesContent.trim() !== ""
      ) {
        try {
          const sheet = new CSSStyleSheet();
          await sheet.replace(componentSpecificStylesContent);
          sheetsToAdopt.push(sheet);
        } catch (e) {
          console.warn(
            `WebComponent (SC): Could not create CSSStyleSheet for component-specific styles in ${tagName}. Error: ${e.message}. Styles may not be applied correctly.`
          );
          // Fallback to <style> tag within shadow DOM if adoptedStyleSheets fails for component styles
          const styleTag = document.createElement("style");
          styleTag.textContent = componentSpecificStylesContent;
          this._root.prepend(styleTag); // Prepend to ensure it's there before content
        }
      }

      // Filter out nulls (if global fetch failed) and ensure unique sheets
      const finalSheets = [
        ...new Set(sheetsToAdopt.filter((s) => s instanceof CSSStyleSheet)),
      ];
      this._root.adoptedStyleSheets = finalSheets;
    }

    render() {
      if (!this._connected && !this.shadowRoot) return;

      const currentTemplate =
        typeof template === "function"
          ? template(this.getState ? this.getState() : {}, this._props)
          : template;

      this._removeEventListeners(); // Clean up listeners from previous render

      // Apply styles first (async) then update template
      this._applyStyles()
        .then(() => {
          if (!this._connected && !this.shadowRoot) return; // Double check connection after async style application

          this._root.innerHTML = ""; // Clear content *after* styles are potentially applied

          const templateElement = document.createElement("template");
          templateElement.innerHTML = currentTemplate;
          this._root.appendChild(templateElement.content.cloneNode(true));

          this._setupEventListeners(); // Re-attach listeners to new DOM
        })
        .catch((e) => {
          console.error(
            `WebComponent (SC): Error during style application or rendering for ${tagName}`,
            e
          );
        });
    }

    // connectedCallback, disconnectedCallback, attributeChangedCallback, _handlePropChange,
    // _setupEventListeners, _removeEventListeners
    // (These methods would be the same as in the previous detailed version, ensuring they call render, manage state, etc.)
    connectedCallback() {
      this._connected = true;
      Component.observedAttributes.forEach((attrName) => {
        if (this.hasAttribute(attrName)) {
          const propName = kebabToCamel(attrName);
          const definition = propDefinitions[propName];
          const type =
            definition && typeof definition === "object" && definition.type
              ? definition.type
              : typeof definition === "function"
              ? definition
              : String;
          this._props[propName] = convertAttributeValue(
            this.getAttribute(attrName),
            type
          );
        }
      });

      if (!this._stateInitialized) {
        const stateInitValue =
          typeof initialStateOption === "function"
            ? initialStateOption(this._props)
            : typeof initialStateOption === "object" &&
              initialStateOption !== null
            ? { ...initialStateOption }
            : {};
        const [getState, setState, subscribe] = createState(stateInitValue);
        this.getState = getState;
        this.setState = (updater) => {
          if (this._connected) setState(updater);
        };
        this._stateUnsubscribe = subscribe(() => {
          if (this._connected) this.render();
        });
        this._stateInitialized = true;
      }

      if (onConnect && typeof onConnect === "function") onConnect(this);
      this.render();
      // Note: _setupEventListeners is called at the end of render()
    }

    disconnectedCallback() {
      this._connected = false;
      if (this._stateUnsubscribe) this._stateUnsubscribe();
      this._removeEventListeners();
      if (onDisconnect && typeof onDisconnect === "function")
        onDisconnect(this);
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
      if (!this._connected && oldValue === null) return;
      const propName = kebabToCamel(attrName);
      const definition = propDefinitions[propName];
      if (definition) {
        const type =
          typeof definition === "object" && definition.type
            ? definition.type
            : typeof definition === "function"
            ? definition
            : String;
        const convertedValue = convertAttributeValue(newValue, type);
        const oldPropValue = this._props[propName];
        this._props[propName] = convertedValue;
        if (
          this._connected &&
          (oldPropValue !== convertedValue ||
            typeof convertedValue === "object")
        ) {
          this._handlePropChange(propName, oldPropValue, convertedValue);
        }
      }
    }

    _handlePropChange(propName, oldValue, newValue) {
      let preventRender = false;
      if (onPropsChange && typeof onPropsChange === "function") {
        if (onPropsChange(this, propName, oldValue, newValue) === false)
          preventRender = true;
      }
      if (!preventRender) this.render();
    }

    _setupEventListeners() {
      this._eventCleanupFns = [];
      for (const selector in eventDelegation) {
        const events = eventDelegation[selector];
        qsa(selector, this._root).forEach((el) => {
          for (const eventType in events) {
            const handlerName = events[eventType];
            const handler = this._methods[handlerName] || this[handlerName];
            if (handler && typeof handler === "function") {
              this._eventCleanupFns.push(
                on(el, eventType, (e) => handler(e, el))
              );
            } else {
              console.warn(
                `WebComponent (SC): Method ${handlerName} not found on ${tagName} for event delegation on "${selector}".`
              );
            }
          }
        });
      }
    }

    _removeEventListeners() {
      this._eventCleanupFns.forEach((cleanup) => cleanup());
      this._eventCleanupFns = [];
    }
  } // End of Component class

  customElements.define(tagName, Component);
  return Component;
}
