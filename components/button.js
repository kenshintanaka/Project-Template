import { defineComponent } from "../lib/web-components.js";

/**
 * @typedef {'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'} ButtonVariant
 * @typedef {'default' | 'sm' | 'lg' | 'icon'} ButtonSize
 */

defineComponent("sc-button", {
  tailwindGlobalCssUrl: "/css/output.css", // Crucial for Tailwind in Shadow DOM
  props: {
    variant: { type: String, default: "default", reflects: true }, // 'default', 'destructive', 'outline', 'secondary', 'ghost', 'link'
    size: { type: String, default: "default", reflects: true }, // 'default', 'sm', 'lg', 'icon'
    disabled: { type: Boolean, default: false, reflects: true },
    type: { type: String, default: "button", reflects: true }, // For <button>: 'button', 'submit', 'reset'
    href: { type: String, default: null, reflects: true }, // If present, renders as <a>
    target: { type: String, default: null, reflects: true }, // For <a>
    rel: { type: String, default: null, reflects: true }, // For <a>
    extraClass: { type: String, default: "", reflects: false }, // User-provided additional classes
  },
  template: (state, props) => {
    const baseClasses =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    let variantClasses = "";
    switch (props.variant) {
      case "destructive":
        variantClasses =
          "bg-destructive text-destructive-foreground hover:bg-destructive/90";
        break;
      case "outline":
        variantClasses =
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
        break;
      case "secondary":
        variantClasses =
          "bg-secondary text-secondary-foreground hover:bg-secondary/80";
        break;
      case "ghost":
        variantClasses = "hover:bg-accent hover:text-accent-foreground";
        break;
      case "link":
        variantClasses = "text-primary underline-offset-4 hover:underline";
        break;
      case "default":
      default:
        variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90";
        break;
    }

    let sizeClasses = "";
    switch (props.size) {
      case "sm":
        sizeClasses = "h-9 px-3";
        break;
      case "lg":
        sizeClasses = "h-11 px-8";
        break;
      case "icon":
        sizeClasses = "h-10 w-10";
        break;
      case "default":
      default:
        sizeClasses = "h-10 px-4 py-2";
        break;
    }

    const userClasses = props.extraClass || "";
    const combinedClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      userClasses,
    ]
      .filter(Boolean)
      .join(" ")
      .trim()
      .replace(/\s+/g, " ");

    const isDisabled = !!props.disabled;
    const commonAttrs = `class="${combinedClasses}" ${
      isDisabled ? 'aria-disabled="true"' : ""
    }`;

    if (props.href) {
      const tabIndex = isDisabled ? 'tabindex="-1"' : "";
      return `
        <a
          href="${props.href}"
          ${props.target ? `target="${props.target}"` : ""}
          ${props.rel ? `rel="${props.rel}"` : ""}
          ${commonAttrs}
          ${tabIndex}
          role="button"
        >
          <slot></slot>
        </a>
      `;
    } else {
      return `
        <button
          type="${props.type || "button"}"
          ${commonAttrs}
          ${isDisabled ? "disabled" : ""}
        >
          <slot></slot>
        </button>
      `;
    }
  },
  onConnect(instance) {
    // You could add logic here if needed when the button connects,
    // for example, to attach more complex event listeners not covered by eventDelegation.
    // console.log(`sc-button "${instance.textContent.trim()}" connected. Variant: ${instance.props.variant}, Size: ${instance.props.size}`);
  },
  // No specific methods, initialState, or eventDelegation needed for this basic button.
  // Click events on the <button> or <a> will behave as standard HTML elements.
});
