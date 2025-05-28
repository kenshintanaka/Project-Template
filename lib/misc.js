/**
 * ==========================================================================
 * Miscellaneous Utilities
 * ==========================================================================
 */

/**
 * Generates a UUID v4 (Universally Unique Identifier).
 * @returns {string} A UUID v4 string.
 */
export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Attempts to copy a string to the clipboard.
 * Uses the modern Clipboard API if available, with a fallback to execCommand.
 * @param {string} text - The text to copy.
 * @returns {Promise<void>} A promise that resolves when copy is successful, or rejects on failure.
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text using navigator.clipboard: ", err);
      return copyToClipboardExecCommand(text);
    }
  } else {
    return copyToClipboardExecCommand(text);
  }
}

/**
 * Fallback method for copyToClipboard using execCommand.
 * @param {string} text - The text to copy.
 * @returns {Promise<void>}
 * @private
 */
function copyToClipboardExecCommand(text) {
  return new Promise((resolve, reject) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        resolve();
      } else {
        reject(new Error("Copying text command was unsuccessful"));
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
      reject(err);
    }

    document.body.removeChild(textArea);
  });
}
