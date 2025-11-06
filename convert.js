let rtcs; // Remains 'let' as it seems to be an external variable placeholder

/**
 * Sets focus on the input field 'x' of the 'calcform'.
 * Assumes 'calcform' and 'x' exist in the document.
 */
const setfocus = () => {
    // Better practice would be to use document.querySelector('#calcform').querySelector('[name="x"]')
    // but preserving the original structure for compatibility.
    document.calcform.x.focus();
};

/**
 * Calculates result for a single input 'x'.
 * Assumes 'convert', 'roundresult' functions exist globally.
 */
const calc = () => {
    const x = document.calcform.x.value;
    let y = convert(x);
    y = roundresult(y);
    document.calcform.y.value = y;
};

/**
 * Calculates result for a single input 'x' using a different rounding function.
 * Assumes 'convert', 'roundresult1' functions exist globally.
 */
const calctest = () => {
    const x = document.calcform.x.value;
    let y = convert(x);
    y = roundresult1(y); // Assumes roundresult1 exists
    document.calcform.y.value = y;
};

/**
 * Calculates result for two inputs 'x1' and 'x2'.
 * Assumes 'convert', 'roundresult' functions exist globally.
 */
const calc3 = () => {
    const x1 = document.calcform.x1.value;
    const x2 = document.calcform.x2.value;
    let y = convert(x1, x2);
    y = roundresult(y);
    document.calcform.y.value = y;
};

/**
 * Calculates result for three inputs 'x1', 'x2', and 'x3'.
 * Assumes 'convert', 'roundresult' functions exist globally.
 */
const calc4 = () => {
    const x1 = document.calcform.x1.value;
    const x2 = document.calcform.x2.value;
    const x3 = document.calcform.x3.value;
    let y = convert(x1, x2, x3);
    y = roundresult(y);
    document.calcform.y.value = y;
};

/**
 * Calculates two separate results (convert1 and convert2) from a single input 'x'.
 * Assumes 'convert1', 'convert2', 'roundresult' functions exist globally.
 */
const calc5 = () => {
    const x = document.calcform.x.value;
    let y1 = roundresult(convert1(x)); // Renamed to y1 for clarity
    document.calcform.y1.value = y1;

    let y2 = roundresult(convert2(x)); // Renamed to y2 for clarity
    document.calcform.y2.value = y2;
};

/**
 * Converts a string to a number, handling localization and arithmetic expressions.
 * @param {string} inputString - The string to convert/evaluate.
 * @param {number} [evaluate=1] - Flag to indicate whether to evaluate the expression (1) or just clean the string (0/false).
 * @returns {number|string} The evaluated number or the cleaned string.
 */
const str2num = (inputString, evaluate = 1) => {
    // Determine the localized decimal separator.
    const decimalSeparator = (1.1).toLocaleString().substring(1, 2);
    const thousandSeparator = (1000).toLocaleString().substring(1, 2); // Not strictly used in logic but good to know

    let e = String(inputString).trim();

    // Remove invalid characters except digits, spaces, separators, arithmetic ops, and 'e'.
    e = e.replace(/[^\d\s.,\-+*/e]/g, "");

    // Handle space as a potential addition operator if it's not dividing a number (like in "1 2/3")
    if (e.includes(" ") && e.includes("/")) {
        // Replace spaces between digits that are followed by a digit (like "1 2" in "1 2/3") with plus
        e = e.replace(/(\d)(\s+)(?=\d)/gm, "$1+");
    }

    // Remove remaining spaces
    e = e.replace(/\s/g, "");

    // Localization handling based on the determined decimal separator (e.g., ',' for German/French)
    if (decimalSeparator === ",") {
        const dotCount = (e.match(/\u002E/g) || []).length;
        const commaCount = (e.match(/\u002C/g) || []).length;

        if (dotCount === 0) {
            // No dot: if 1 comma, it's the decimal. If >1 comma, remove them (thousand separators).
            if (commaCount === 1) {
                e = e.replace(/\u002C/g, ".");
            } else if (commaCount > 1) {
                e = e.replace(/\u002C/g, "");
            }
        } else if (commaCount === 0) {
            // No comma: if >1 dot, remove them (thousand separators).
            if (dotCount > 1) {
                e = e.replace(/\u002E/g, "");
            }
        } else if (dotCount > 0 && commaCount > 0) {
            // Both dot and comma: determine which is the decimal.
            // If dot comes first, it's the thousand separator (remove it), comma is the decimal (replace with dot).
            e = e.indexOf(".") < e.indexOf(",")
                ? e.replace(/\u002E/g, "").replace(/\u002C/g, ".")
                : e.replace(/\u002C/g, ""); // Comma is thousand separator (remove it)
        }
    } else {
        // Default (dot is decimal): remove all commas (as thousand separators).
        e = e.replace(/\u002C/g, "");
    }

    // Standardize multiplication/division symbols
    e = e.replace("×", "*").replace("÷", "/");

    // If the cleaned string is empty, return 0.
    if (e === "") {
        return 0;
    }

    // Evaluate the expression if the flag is set.
    return evaluate
        ? new Function(`"use strict";return (${e})`)()
        : e;
};

/**
 * Cleans a string for arithmetic evaluation, forcing dot as decimal separator.
 * @param {string} inputString - The string to clean.
 * @returns {string} The cleaned string.
 */
const str2num2 = (inputString) => {
    let e = String(inputString).trim();
    // 1. Replace space between digits with plus (e.g., "1 2" -> "1+2")
    e = e.replace(/(\d)(\s+)(?=\d)/gm, "$1+");
    // 2. Replace comma with dot (force dot as decimal)
    e = e.replace(/,/g, ".");
    // 3. Remove single quote and space (as thousand/grouping separators)
    e = e.replace(/['\s]/g, "");
    // 4. Remove invalid characters except arithmetic/scientific/special function symbols
    e = e.replace(/[^-()e\d/*×÷+.%^!&|isqrt]/g, "");
    // 5. Standardize multiplication/division symbols
    e = e.replace("×", "*").replace("÷", "/");
    return e;
};

/**
 * Splits a string by space and converts each part to a number using str2num,
 * special-casing "whole number fraction" inputs like "1 1/2".
 * @param {string} inputString - The string of space-separated values.
 * @returns {Array<number>} An array of numbers.
 */
const str2num3 = (inputString) => {
    const t = inputString.split(" ");
    if (t.length === 2 && t[1].includes("/")) {
        // Handle "whole number fraction" (e.g., "1 1/2") as a single number
        return [str2num(inputString)];
    } else {
        // Handle multiple space-separated numbers
        // Use map for cleaner array creation
        return t.map(n => str2num(n));
    }
};

/**
 * Replaces commas with dots in a string.
 * @param {string} inputString - The string to process.
 * @returns {string} The string with dots instead of commas.
 */
const str2num4 = (inputString) => {
    return inputString.replace(/,/g, ".");
};

/**
 * Converts a number to a localized string representation with optional precision.
 * @param {number} num - The number to convert.
 * @param {number} [precision=-1] - The desired number of fraction digits. -1 means automatic/default (up to 20).
 * @returns {string} The localized number string.
 */
const num2str = (num, precision = -1) => {
    let e = String(num);

    // If scientific notation is present, just localize the decimal point and return.
    if (e.includes("e")) {
        const decimalSeparator = (1.1).toLocaleString().substring(1, 2);
        return e.replace(".", decimalSeparator);
    }

    // Attempt to handle negative number extraction (this logic is somewhat confusing but kept for functional parity)
    // The original logic `e = Number(e = (e = e.replace("âˆ’", "-")).substring(e.indexOf("-")));` seems to try to extract the number
    // from a string representation that might contain an unusual minus sign ('âˆ−') and then take the substring from the first minus sign.
    // For modernization, we assume `num` is a standard number and use `parseFloat` if it was passed as a string/object.
    // The minus sign replacement is kept just in case.
    e = e.replace("âˆ’", "-");
    const numberValue = parseFloat(e);

    const minDigits = precision < 0 ? 0 : precision;
    const maxDigits = precision < 0 ? 20 : precision; // Use 20 as max if precision is not specified.

    e = numberValue.toLocaleString(undefined, {
        minimumFractionDigits: minDigits,
        maximumFractionDigits: maxDigits,
    });

    // Remove multiplication symbol (times symbol) if present from localization process
    return e.trim().replace(/×/g, "");
};

/**
 * Converts a number to a string and adds localized thousands separators.
 * @param {number} num - The number to convert.
 * @returns {string} The localized string with thousands separators.
 */
const num2str2 = (num) => {
    let e = String(num);
    const decimalSeparator = (1.1).toLocaleString().substring(1, 2);
    const thousandSeparator = (1000).toLocaleString().substring(1, 2);

    // Replace standard dot with localized decimal separator
    e = e.replace(".", decimalSeparator);

    // If scientific notation, return it as is (localized decimal already done)
    if (e.includes("e")) return e;

    const decimalIndex = e.indexOf(decimalSeparator);
    const integerEndIndex = decimalIndex === -1 ? e.length : decimalIndex;

    // Apply thousand separators to the integer part only
    for (let i = integerEndIndex - 3; i > 0; i -= 3) {
        e = e.slice(0, i) + thousandSeparator + e.slice(i);
    }

    return e;
};

/**
 * Checks if a number is an integer.
 * @param {*} num - The value to check.
 * @returns {boolean} True if the value is a number and an integer.
 */
const isInt = (num) => {
    return Number(num) === num && num % 1 === 0;
};

/**
 * Checks if a number is a float (non-integer).
 * @param {*} num - The value to check.
 * @returns {boolean} True if the value is a number and a non-integer.
 */
const isFloat = (num) => {
    return Number(num) === num && num % 1 !== 0;
};

/**
 * Converts all 'number' input types to 'text' to allow non-native localization/input handling,
 * unless the window width is too small (mobile/small screen) or n2tskip is defined.
 */
const inputnum2txt = () => {
    // Check if the screen is wider than 800px AND n2tskip is not defined.
    if (window.innerWidth >= 800 && typeof n2tskip === "undefined") {
        // Use modern querySelectorAll and forEach (or for...of)
        const numberInputs = document.querySelectorAll("input[type=number]");

        numberInputs.forEach(input => {
            input.type = "text";
            input.removeAttribute("min");
            input.removeAttribute("max");
            input.removeAttribute("step");
        });
    }
};

/**
 * Detects the user's operating system (limited to Android/iOS/unknown).
 * @returns {string} The detected OS name.
 */
const GetOS = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Android")) return "Android";
    // 'like Mac' often indicates iOS/iPadOS
    if (userAgent.includes("like Mac")) return "iOS";
    return "unknown";
};

/**
 * Sets input attributes based on the detected OS for better mobile input experience.
 * @param {HTMLElement} element - The input element to modify.
 */
const setInput = (element) => {
    const os = GetOS();
    if (os === "iOS") {
        element.type = "number";
        element.step = "any";
        return;
    }
    if (os === "Android") {
        element.setAttribute("inputmode", "numeric");
    }
};

/**
 * Decodes a URI component, replacing '+' with space.
 * @param {string} encodedURI - The encoded URI component.
 * @returns {string} The decoded string.
 */
const decodeURIComponent2 = (encodedURI) => {
    return decodeURIComponent(encodedURI.replace(/\+/g, " "));
};

/**
 * Rounds a number using the specialized roundnum function.
 * @param {number} num - The number to round.
 * @returns {number|string} The rounded result (can be a string from roundnum).
 */
const roundresult = (num) => {
    // Note: the original code had 'y = roundnum(y = parseFloat(e), 10)' which is confusing.
    // Assuming 'e' is the input number 'num' and it uses a fixed precision of 10.
    const floatNum = parseFloat(num);
    return roundnum(floatNum, 10);
};

/**
 * Rounds a number to a specified number of digits (r) and removes trailing zeros/decimal point.
 * @param {number} num - The number to round.
 * @param {number} digits - The number of digits for fixed-point rounding.
 * @returns {string} The rounded number as a string, with trailing zeros/dot removed.
 */
const roundnum = (num, digits) => {
    // 1. Round to fixed digits (this handles the rounding logic)
    let n = String(parseFloat(num).toFixed(digits));

    let eIndex = n.indexOf("e");
    if (eIndex === -1) {
        eIndex = n.length;
    }

    const decimalIndex = n.indexOf(".");

    // If there is a decimal point and it's before the 'e' (or no 'e')
    if (eIndex > decimalIndex && decimalIndex !== -1) {
        // Loop backwards from 'eIndex' (or end of string) to remove trailing zeros.
        let i = eIndex;
        while (i > 0) {
            i--;
            if (n.charAt(i) === "0") {
                n = removeAt(n, i);
            } else {
                break; // Stop when a non-zero character is found.
            }
        }
        // Check if the loop stopped on a decimal point.
        if (n.charAt(i) === ".") {
            n = removeAt(n, i);
        }
    }
    return n;
};

/**
 * Removes a character at a specific index in a string.
 * @param {string} str - The input string.
 * @param {number} index - The index of the character to remove.
 * @returns {string} The new string.
 */
const removeAt = (str, index) => {
    return str.substring(0, index) + str.substring(index + 1, str.length);
};

// Use modern DOMContentLoaded event listener (already present, just kept)
window.addEventListener("DOMContentLoaded", () => {
    inputnum2txt();
});
