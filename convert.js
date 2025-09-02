let rtcs;

function setFocus() {
  document.calcform.x.focus();
}

/**
 * Main calculation function for single input.
 */
function calc() {
  const x = document.calcform.x.value;
  const y = convert(x);
  document.calcform.y.value = roundResult(y);
}

/**
 * Test calculation function using a different rounding method.
 */
function calcTest() {
  const x = document.calcform.x.value;
  const y = convert(x);
  document.calcform.y.value = roundResult1(y);
}

/**
 * Calculation function for two inputs.
 */
function calc3() {
  const x1 = document.calcform.x1.value;
  const x2 = document.calcform.x2.value;
  const y = convert(x1, x2);
  document.calcform.y.value = roundResult(y);
}

/**
 * Calculation function for three inputs.
 */
function calc4() {
  const x1 = document.calcform.x1.value;
  const x2 = document.calcform.x2.value;
  const x3 = document.calcform.x3.value;
  const y = convert(x1, x2, x3);
  document.calcform.y.value = roundResult(y);
}

/**
 * Calculation function with two separate outputs.
 */
function calc5() {
  const x = document.calcform.x.value;

  const y1 = convert1(x);
  document.calcform.y1.value = roundResult(y1);

  const y2 = convert2(x);
  document.calcform.y2.value = roundResult(y2);
}

/**
 * Converts a string to a number, handling different locale formats.
 * @param {string} str The string to convert.
 * @param {boolean} evaluate If true, evaluates the string as a mathematical expression.
 */
function str2num(str, evaluate = true) {
  let cleanedStr = str.toString().trim().replace(/[^\d\s.,-+\*\/e]/g, "");

  // Handle space-separated numbers as addition
  if (cleanedStr.includes(" ") && cleanedStr.includes("/")) {
    cleanedStr = cleanedStr.replace(/(\d)(\s+)(?=\d)/gm, "$1+");
  }
  cleanedStr = cleanedStr.replace(/\s/g, "");

  // Locale-specific number formatting
  const decimalChar = (1.1).toLocaleString().substring(1, 2);
  if (decimalChar === ",") {
    const periodCount = (cleanedStr.match(/\./g) || []).length;
    const commaCount = (cleanedStr.match(/,/g) || []).length;

    if (periodCount === 0 && commaCount > 0) {
      if (commaCount === 1) {
        cleanedStr = cleanedStr.replace(/,/g, ".");
      } else {
        cleanedStr = cleanedStr.replace(/,/g, "");
      }
    } else if (commaCount === 0 && periodCount > 1) {
      cleanedStr = cleanedStr.replace(/\./g, "");
    } else if (periodCount > 0 && commaCount > 0) {
      if (cleanedStr.indexOf(".") < cleanedStr.indexOf(",")) {
        cleanedStr = cleanedStr.replace(/\./g, "").replace(/,/g, ".");
      } else {
        cleanedStr = cleanedStr.replace(/,/g, "");
      }
    }
  } else {
    cleanedStr = cleanedStr.replace(/,/g, "");
  }

  cleanedStr = cleanedStr.replace("×", "*").replace("÷", "/");
  if (cleanedStr === "") return 0;
  
  return evaluate ? Function(`"use strict";return (${cleanedStr})`)() : cleanedStr;
}

/**
 * Cleans up a string for numerical evaluation.
 */
function str2num2(str) {
  return str.toString()
    .trim()
    .replace(/(\d)(\s+)(?=\d)/gm, "$1+")
    .replace(/,/g, ".")
    .replace(/['\s]/g, "")
    .replace(/[^-()e\d/*×÷+.%^!&|isqrt]/g, "")
    .replace("×", "*")
    .replace("÷", "/");
}

/**
 * Converts a space-separated string of numbers to an array of numbers.
 */
function str2num3(str) {
  const parts = str.split(" ");
  if (parts.length === 2 && parts[1].includes("/")) {
    return [str2num(str)];
  }

  return parts.map(part => str2num(part));
}

/**
 * Replaces commas with periods.
 */
function str2num4(str) {
  return str.replace(/,/g, ".");
}

/**
 * Converts a number to a localized string.
 * @param {number} num The number to convert.
 * @param {number} precision The number of decimal places.
 */
function num2str(num, precision = -1) {
  let str = num.toString();
  if (str.includes("e")) {
    const decimalChar = (1.1).toLocaleString().substring(1, 2);
    return str.replace(".", decimalChar);
  }

  num = Number(str.replace("−", "-"));
  const minDigits = precision < 0 ? 0 : precision;
  const maxDigits = precision < 0 ? 20 : precision;

  return num.toLocaleString(undefined, {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits
  }).trim().replace(/×/g, "");
}

/**
 * Converts a number to a localized string, adding thousands separators.
 */
function num2str2(num) {
  const decimalChar = (1.1).toLocaleString().substring(1, 2);
  const thousandsChar = (1000).toLocaleString().substring(1, 2);
  let str = num.toString().replace(".", decimalChar);

  if (str.includes("e")) return str;

  const decimalIndex = str.indexOf(decimalChar);
  const integerPart = decimalIndex === -1 ? str : str.substring(0, decimalIndex);
  const fractionalPart = decimalIndex === -1 ? "" : str.substring(decimalIndex);

  let formattedInteger = "";
  for (let i = integerPart.length - 1, count = 0; i >= 0; i--, count++) {
    formattedInteger = integerPart.charAt(i) + formattedInteger;
    if (count % 3 === 2 && i > 0) {
      formattedInteger = thousandsChar + formattedInteger;
    }
  }

  return formattedInteger + fractionalPart;
}

/**
 * Checks if a number is an integer.
 */
function isInt(num) {
  return Number(num) === num && num % 1 === 0;
}

/**
 * Checks if a number is a float.
 */
function isFloat(num) {
  return Number(num) === num && num % 1 !== 0;
}

/**
 * Changes number input types to text for broader browser compatibility.
 */
function inputnum2txt() {
  if (window.innerWidth >= 800 && typeof n2tskip === "undefined") {
    const numberInputs = document.querySelectorAll("input[type=number]");
    numberInputs.forEach(input => {
      input.type = "text";
      input.removeAttribute("min");
      input.removeAttribute("max");
      input.removeAttribute("step");
    });
  }
}

/**
 * Detects the operating system.
 */
function getOS() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("like Mac")) return "iOS";
  return "unknown";
}

/**
 * Sets input attributes based on the OS.
 */
function setInput(input) {
  const os = getOS();
  if (os === "iOS") {
    input.type = "number";
    input.step = "any";
  } else if (os === "Android") {
    input.setAttribute("inputmode", "numeric");
  }
}

/**
 * Decodes a URI component, replacing plus signs with spaces.
 */
function decodeURIComponent2(str) {
  return decodeURIComponent(str.replace(/\+/g, " "));
}

/**
 * Rounds a number to a fixed precision (10 decimal places).
 */
function roundResult(num) {
  return roundNum(parseFloat(num), 10);
}

/**
 * Rounds a number and removes trailing zeros.
 * @param {number} num The number to round.
 * @param {number} precision The number of decimal places.
 */
function roundNum(num, precision) {
  let str = num.toFixed(precision);
  
  // Remove trailing zeros and the decimal point if it's the last character
  str = str.replace(/(\.\d*?)0+$/, "$1");
  str = str.replace(/\.$/, "");
  
  return str;
}

window.addEventListener("DOMContentLoaded", () => {
  inputnum2txt();
});
