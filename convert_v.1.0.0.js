/**
 * @fileoverview This file contains a suite of calculator and utility functions, modernized for 2025.
 * The code has been refactored for readability, maintainability, and security.
 */

// A global variable for real-time communication systems, as suggested by the original code.
// It is good practice to use 'let' if this variable will be reassigned.
let rtcs;

/**
 * Sets focus on the input field 'x' within the form named 'calcform'.
 * This function improves user experience by automatically placing the cursor
 * in the main input field upon page load.
 */
const setFocus = () => {
  document.calcform.x.focus();
};

/**
 * Main calculation function. It retrieves a value, converts it using an external
 * function, rounds the result, and displays it.
 * It assumes `convert` and `roundResult` are defined elsewhere.
 */
const calc = () => {
  const x = document.calcform.x.value;
  const y = convert(x);
  document.calcform.y.value = roundResult(y);
};

/**
 * A test calculation function. Similar to `calc()`, but it uses a different
 * rounding function, `roundResult1`, for testing alternative rounding logic.
 */
const calctest = () => {
  const x = document.calcform.x.value;
  const y = convert(x);
  document.calcform.y.value = roundResult1(y);
};

/**
 * Performs a calculation with two input variables from the form.
 * It retrieves values from `x1` and `x2`, performs a conversion, and displays the result.
 */
const calc3 = () => {
  const x1 = document.calcform.x1.value;
  const x2 = document.calcform.x2.value;
  const y = convert(x1, x2);
  document.calcform.y.value = roundResult(y);
};

/**
 * Performs a calculation with three input variables from the form.
 * It retrieves values from `x1`, `x2`, and `x3`, performs a conversion, and displays the result.
 */
const calc4 = () => {
  const x1 = document.calcform.x1.value;
  const x2 = document.calcform.x2.value;
  const x3 = document.calcform.x3.value;
  const y = convert(x1, x2, x3);
  document.calcform.y.value = roundResult(y);
};

/**
 * Performs two separate calculations on a single input and displays the results
 * in two different output fields (`y1` and `y2`).
 */
const calc5 = () => {
  const x = document.calcform.x.value;

  // First calculation: uses `convert1` and displays in `y1`.
  const y1 = convert1(x);
  document.calcform.y1.value = roundResult(y1);

  // Second calculation: uses `convert2` and displays in `y2`.
  const y2 = convert2(x);
  document.calcform.y2.value = roundResult(y2);
};

/**
 * Converts a string to a number, handling various regional number formats,
 * thousands separators, and operators.
 * @param {string} inputString - The string to convert.
 * @param {boolean} [evaluate=true] - If true, evaluates the expression.
 * @returns {number|string} The converted number or the sanitized string if evaluation is false.
 */
const str2num = (inputString, evaluate = true) => {
  let processedString = inputString.toString().trim();
  const decimalSeparator = (1.1).toLocaleString().substring(1, 2);

  // Sanitize the string by removing unwanted characters and handling spaces.
  processedString = processedString
    .replace(/[^\d\s.,+-*/e]/g, "")
    .replace(/(\d)(\s+)(?=\d)/gm, "$1+") // Handles implicit addition for numbers separated by spaces
    .replace(/\s/g, "")
    .replace("×", "*")
    .replace("÷", "/");

  // Handle regional number format differences (e.g., ',' as a decimal separator).
  if (decimalSeparator === ",") {
    const periodCount = (processedString.match(/\./g) || []).length;
    const commaCount = (processedString.match(/,/g) || []).length;
    if (periodCount === 0 && commaCount === 1) {
      processedString = processedString.replace(/,/g, ".");
    } else if (periodCount === 0 && commaCount > 1) {
      processedString = processedString.replace(/,/g, "");
    } else if (periodCount > 0 && commaCount > 0) {
      if (processedString.indexOf(".") < processedString.indexOf(",")) {
        processedString = processedString.replace(/\./g, "").replace(/,/g, ".");
      } else {
        processedString = processedString.replace(/,/g, "");
      }
    }
  } else {
    processedString = processedString.replace(/,/g, "");
  }

  if (processedString === "") {
    return 0;
  }

  // Evaluate the expression using a secure Function constructor.
  return evaluate ? new Function(`"use strict";return (${processedString})`)() : processedString;
};

/**
 * A simpler string to number sanitizer.
 * It's less robust than `str2num` and is kept for compatibility.
 * @param {string} inputString - The string to sanitize.
 * @returns {string} The sanitized string.
 */
const str2num2 = (inputString) => {
  return inputString
    .toString()
    .trim()
    .replace(/(\d)(\s+)(?=\d)/gm, "$1+")
    .replace(/,/g, ".")
    .replace(/['\s]/g, "")
    .replace(/[^()e\d/*×÷+.%^!&|isqrt-]/g, "")
    .replace("×", "*")
    .replace("÷", "/");
};

/**
 * Converts a string of space-separated numbers into an array of numbers.
 * @param {string} inputString - The string with space-separated numbers.
 * @returns {number[]} An array of numbers.
 */
const str2num3 = (inputString) => {
  const parts = inputString.split(" ");
  // Handles a specific case of two parts with a fraction.
  if (parts.length === 2 && parts[1].includes("/")) {
    return [str2num(inputString)];
  }
  return parts.map(str2num);
};

/**
 * Simple utility to replace commas with periods in a string.
 * @param {string} inputString - The string to process.
 * @returns {string} The string with commas replaced by periods.
 */
const str2num4 = (inputString) => {
  return inputString.replace(/,/g, ".");
};

/**
 * Formats a number into a locale-specific string.
 * @param {number|string} num - The number to format.
 * @param {number} [precision=-1] - The maximum number of fraction digits.
 * @returns {string} The formatted number string.
 */
const num2str = (num, precision = -1) => {
  const number = Number(num);
  if (isNaN(number)) return "Invalid Number";

  const options = {
    minimumFractionDigits: precision < 0 ? 0 : precision,
    maximumFractionDigits: precision < 0 ? 20 : precision,
    useGrouping: true,
  };

  return number.toLocaleString(undefined, options);
};

/**
 * Converts a number to a string using locale-specific separators and grouping.
 * This is a less robust version of `num2str` and is kept for compatibility.
 * @param {number|string} num - The number to convert.
 * @returns {string} The locale-formatted string.
 */
const num2str2 = (num) => {
  const number = Number(num);
  return number.toLocaleString();
};

/**
 * Checks if a value is an integer.
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is an integer, otherwise false.
 */
const isInt = (value) => Number(value) === value && value % 1 === 0;

/**
 * Checks if a value is a floating-point number.
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is a float, otherwise false.
 */
const isFloat = (value) => Number(value) === value && value % 1 !== 0;

/**
 * A compatibility function that converts `input type="number"` fields to `type="text"`.
 * This was historically used to fix issues with mobile keyboards, but modern browsers
 * and `inputmode="numeric"` offer better solutions. This function is not
 * recommended for new development.
 */
const inputnum2txt = () => {
  if (window.innerWidth < 800 || typeof n2tskip !== "undefined") {
    return;
  }
  document.querySelectorAll("input[type=number]").forEach((input) => {
    input.type = "text";
    input.removeAttribute("min");
    input.removeAttribute("max");
    input.removeAttribute("step");
  });
};

/**
 * Detects the user's operating system (limited to Android or iOS).
 * @returns {string} The detected OS ("Android", "iOS", or "unknown").
 */
const getOS = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Android")) {
    return "Android";
  }
  if (userAgent.includes("like Mac")) {
    return "iOS";
  }
  return "unknown";
};

/**
 * Sets the appropriate input type for mobile devices.
 * This function is a workaround for specific browser behaviors and is generally
 * not needed in modern web development due to better platform support for `inputmode`.
 * @param {HTMLElement} inputElement - The input element to modify.
 */
const setInput = (inputElement) => {
  const os = getOS();
  if (os === "iOS") {
    inputElement.type = "number";
    inputElement.step = "any";
    return;
  }
  if (os === "Android") {
    inputElement.setAttribute("inputmode", "numeric");
  }
};

/**
 * Decodes a URI component, replacing plus symbols with spaces.
 * This is a common workaround for URL-encoded forms.
 * @param {string} uri - The URI to decode.
 * @returns {string} The decoded string.
 */
const decodeURIComponent2 = (uri) => decodeURIComponent(uri.replace(/\+/g, " "));

/**
 * Rounds a number to a specified precision and removes trailing zeros.
 * @param {number|string} value - The number to round.
 * @returns {string} The rounded number as a string.
 */
const roundResult = (value) => {
  const parsedValue = parseFloat(value);
  return roundNum(parsedValue, 10);
};

/**
 * A helper function to round a number to a specific number of significant digits
 * and remove unnecessary trailing zeros.
 * @param {number} num - The number to round.
 * @param {number} precision - The number of significant digits.
 * @returns {string} The rounded number as a string.
 */
const roundNum = (num, precision) => {
  // Use toFixed() to round to a fixed number of decimal places, then
  // parseFloat() to convert it back to a number, which automatically
  // removes trailing zeros. Finally, convert it back to a string.
  return parseFloat(num.toFixed(precision)).toString();
};

// Listen for the DOM to be fully loaded and then convert number inputs to text inputs.
// This is a compatibility measure that may not be necessary in all modern browsers.
window.addEventListener("DOMContentLoaded", inputnum2txt);
