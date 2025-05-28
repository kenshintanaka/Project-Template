# Project: Sobbing Cat - Browser-Native Web Components & Utilities

This project provides a powerful toolkit for crafting modern HTML applications that run **entirely in the browser**. It champions the use of **Sobbing Cat (sc-) Web Components**, styled with [Tailwind CSS](https://tailwindcss.com/), and bolstered by a suite of custom JavaScript utilities and animation helpers. The core aim is to simplify the development of rich, client-side interfaces by making standard browser technologies, especially Web Components, more accessible and easier to manage.

## Table of Contents

1.  [Core Philosophy & Features](#1-core-philosophy--features)
2.  [Sobbing Cat Web Components (`sc-`)](#2-sobbing-cat-web-components-sc-)
    * [Foundation: `defineComponent` Utility – Simplifying Web Components](#foundation-definecomponent-utility--simplifying-web-components)
    * [Available Components](#available-components)
        * [`sc-button`](#sc-button)
3.  [Prerequisites](#3-prerequisites)
4.  [Getting Started](#4-getting-started)
5.  [Included Utilities (`lib/`) for Enhanced Browser-Native Development](#5-included-utilities-lib-for-enhanced-browser-native-development)
    * [Using the Utilities](#using-the-utilities)

---

## 1. Core Philosophy & Features

* **Browser-Native HTML**: Build applications where the HTML structure and interactivity are handled directly by the browser, minimizing server-side dependencies for UI rendering.
* **Sobbing Cat Web Components**: A growing library of custom HTML elements (prefixed with `sc-`) that promote reusability and encapsulation. These are built using our custom `defineComponent` utility, designed to streamline the Web Components API.
* [Tailwind CSS](https://tailwindcss.com/): For rapid, utility-first UI development. (Note: Tailwind CSS requires a CLI build step for the CSS, but the resulting HTML/JS is browser-native).
* **Custom Theme & Animations**: Includes pre-configured theme variables (inspired by [Shadcn UI](https://ui.shadcn.com/)) and animation utility classes within `css/input.css`.
* **Vanilla JS Utilities (`lib/`)**: A comprehensive suite of JavaScript modules to enhance browser-native development, covering DOM manipulation, state management, asynchronous operations, and more, all re-exported from `lib/index.js`. These helpers are designed to make working with standard browser features more intuitive.

[Back to ToC](#table-of-contents)

---

## 2. Sobbing Cat Web Components (`sc-`)

The heart of this project is the "Sobbing Cat" custom element library. These components are designed to be robust, self-contained, and run efficiently in any modern browser, forming the building blocks for your client-side applications.

### Foundation: `defineComponent` Utility – Simplifying Web Components

* **File**: `lib/web-components.js`
* **Description**: The `defineComponent` function is our custom implementation designed to make the powerful, browser-native Web Components API significantly easier to use. It simplifies the creation of all `sc-` components by providing a declarative syntax for:
    * Defining props (attributes) with type conversion and reflection.
    * Managing internal component state, enabling dynamic UIs without complex frameworks.
    * Templating with HTML strings (or functions for dynamic templates) directly rendered by the browser.
    * Styling with CSS strings (or functions), including seamless adoption of global Tailwind CSS into the Shadow DOM for encapsulated styling.
    * Handling standard lifecycle callbacks (`onConnect`, `onDisconnect`, `onPropsChange`).
    * Declarative event delegation for cleaner event handling.
    * Leveraging Shadow DOM for true encapsulation by default.
* **Impact**: This utility empowers you to build sophisticated, browser-native components with less boilerplate, promoting clean code and maintainability.

### Available Components

This section lists the currently available `sc-` components. As the library grows, this list will be updated. Each component is designed for ease of use in browser-native HTML.

#### `sc-button`

* **File**: `components/button.js`
* **Description**: A versatile button component that renders as a native `<button>` or an `<a>` tag, directly usable in your HTML. It showcases how `defineComponent` facilitates the creation of interactive, styleable elements that run entirely client-side.
* **Key Props**:
    * `variant`: Controls the button's appearance.
        * Values: `'default'`, `'destructive'`, `'outline'`, `'secondary'`, `'ghost'`, `'link'`
        * Default: `'default'`
    * `size`: Defines the button's padding and height.
        * Values: `'default'`, `'sm'`, `'lg'`, `'icon'`
        * Default: `'default'`
    * `disabled`: `boolean` (Disables the button and applies appropriate styling). Default: `false`.
    * `href`: `string` (If set, the component renders as an `<a>` tag with this URL). Default: `null`.
    * `target`: `string` (Standard `target` attribute for links). Default: `null`.
    * `rel`: `string` (Standard `rel` attribute for links). Default: `null`.
    * `type`: `string` (For native button: `'button'`, `'submit'`, `'reset'`). Default: `'button'`.
    * `extraClass`: `string` (Allows passing additional CSS classes for custom styling). Default: `""`.
* **Usage Examples**: Refer to `index.html` to see `sc-button` in action with different props.

*(Future components will be listed here.)*

[Back to ToC](#table-of-contents)

---

## 3. Prerequisites

Ensure the Tailwind CSS CLI is installed (for CSS compilation). For installation instructions, visit: [Tailwind CLI Installation](https://tailwindcss.com/docs/installation/tailwind-cli). No other build tools are strictly necessary for the HTML/JS components themselves.

[Back to ToC](#table-of-contents)

---

## 4. Getting Started

To compile Tailwind CSS and watch for changes:

```bash
npx @tailwindcss/cli -i ./css/input.css -o ./css/output.css --watch
````

This command processes `./css/input.css`, generates `./css/output.css`, and watches your HTML and JS files for class changes to rebuild the CSS. Your HTML files, using the `sc-` web components and vanilla JavaScript, can then be opened directly in the browser.

[Back to ToC](#table-of-contents)

-----

## 5. Included Utilities (`lib/`) for Enhanced Browser-Native Development

The `lib/` directory contains a collection of standalone JavaScript modules. These are not a framework, but rather a set of focused tools to make common browser-based development tasks more efficient. All utilities are re-exported from `lib/index.js` for easy importing.

Key utility modules include:

  * **`array.js`**, **`async.js`**, **`date.js`**, **`dom.js`**, **`misc.js`**, **`number.js`**, **`object.js`**, **`state.js`**, **`string.js`**: These modules provide targeted functions for common operations, helping you write cleaner and more effective vanilla JavaScript that interacts directly with browser APIs.
  * **`web-components.js`**: (As detailed above) Contains the crucial `defineComponent` helper, which is key to our approach of simplifying browser-native Web Component development.

### Using the Utilities

Import utilities into your JavaScript files (which can be simple `<script type="module">` tags in your HTML or separate JS files) as needed:

```javascript
// Example: in a <script type="module"> in your index.html or a separate app.js
import { formatDate, qs, createState } from './lib/index.js'; // Adjust path if necessary

// Using formatDate from date.js
const today = formatDate(new Date(), 'MMMM D, YYYY');
const footerDateElement = qs('#footer-date');
if (footerDateElement) footerDateElement.textContent = `Today is ${today}`;

// Using qs from dom.js to interact with an sc-button
const myScButton = qs('sc-button[variant="primary"]'); // Assuming you add such a button
if (myScButton) {
  myScButton.addEventListener('click', () => {
    alert('Sobbing Cat Primary Button Clicked!');
  });
}

// Using createState from state.js for simple client-side state
const [message, setMessage, subscribeMessage] = createState('Hello from browser-native JS!');
const messageDisplay = qs('#message-display');
if (messageDisplay) {
  subscribeMessage(newMessage => messageDisplay.textContent = newMessage);
  // Later: setMessage('Web Components are cool!');
}
```

This project and its utilities are designed to empower you to build directly for the web platform, creating rich experiences that are lightweight and harness the full potential of the browser.

[Back to ToC](#table-of-contents)