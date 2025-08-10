/**
 * NOTE: This refactored code assumes a few things about your HTML:
 * 1. Your form has an id: <form id="mrsancalcform">.
 * 2. All input elements have corresponding id attributes (e.g., <input id="x">).
 * 3. The various 'convert' and 'roundresult1' functions (convert, convert1, convert2, convertbase, roundresult1)
 * are defined elsewhere in your codebase, as they were not included in the original snippet.
 */

// Get the form element once to reuse it in multiple functions.
const calcForm = document.getElementById('mrsancalcform');

// --- Utility Functions ---

/**
 * Rounds a number to a specified precision and removes insignificant trailing zeros.
 * @param {number} num The number to round.
 * @param {number} [precision=10] The total number of significant digits.
 * @returns {number} The rounded number.
 */
const roundNumber = (num, precision = 10) => {
  const number = parseFloat(num);
  if (isNaN(number)) {
    return num; // Return original value if it's not a valid number
  }
  // toPrecision() returns a string. Converting it back to a Number
  // automatically handles rounding and removes trailing zeros.
  return Number(number.toPrecision(precision));
};


// --- Core Calculation Functions ---

/**
 * Sets the focus on a specific input field when the page loads.
 * @param {string} [elementId='x'] The id of the element to focus on.
 */
const setInitialFocus = (elementId = 'x') => {
  calcForm.elements[elementId]?.focus();
};

/**
 * Handles a calculation with one input.
 * Corresponds to the original `calc()` function.
 */
const calculateSingleInput = () => {
  const inputValue = calcForm.elements.x.value;
  // Assumes 'convert(x)' is defined elsewhere
  const result = convert(inputValue);
  calcForm.elements.y.value = roundNumber(result);
};

/**
 * Handles a test calculation.
 * Corresponds to the original `calctest()`.
 * NOTE: Assumes 'roundresult1(y)' is defined elsewhere.
 */
const calculateTest = () => {
  const inputValue = calcForm.elements.x.value;
  // Assumes 'convert(x)' and 'roundresult1(y)' are defined elsewhere
  const result = convert(inputValue);
  calcForm.elements.y.value = roundresult1(result);
};

/**
 * Handles a calculation with two inputs.
 * Corresponds to the original `calc3()`.
 */
const calculateTwoInputs = () => {
  const input1 = calcForm.elements.x1.value;
  const input2 = calcForm.elements.x2.value;
  // Assumes 'convert(x1, x2)' is defined elsewhere
  const result = convert(input1, input2);
  calcForm.elements.y.value = roundNumber(result);
};

/**
 * Handles a calculation with three inputs.
 * Corresponds to the original `calc4()`.
 */
const calculateThreeInputs = () => {
  const input1 = calcForm.elements.x1.value;
  const input2 = calcForm.elements.x2.value;
  const input3 = calcForm.elements.x3.value;
  // Assumes 'convert(x1, x2, x3)' is defined elsewhere
  const result = convert(input1, input2, input3);
  calcForm.elements.y.value = roundNumber(result);
};

/**
 * Handles a calculation that populates two separate output fields.
 * Corresponds to the original `calc5()`.
 */
const calculateAndSplit = () => {
  const inputValue = calcForm.elements.x.value;
  // Assumes 'convert1(x)' and 'convert2(x)' are defined elsewhere
  calcForm.elements.y1.value = roundNumber(convert1(inputValue));
  calcForm.elements.y2.value = roundNumber(convert2(inputValue));
};

/**
 * Handles a base conversion calculation.
 * Corresponds to the original `calcbase(b1, b2)`.
 */
const calculateBaseConversion = (baseFrom, baseTo) => {
  const inputValue = calcForm.elements.x.value;
  // Assumes 'convertbase(x, b1, b2)' is defined elsewhere.
  // Base conversion inputs are typically strings, so parseFloat is not used.
  calcForm.elements.y.value = convertbase(inputValue, baseFrom, baseTo);
};

/**
 * Handles a direct conversion without rounding the result.
 * Corresponds to the original `calcbase2()`.
 */
const calculateWithDirectConversion = () => {
  const inputValue = calcForm.elements.x.value;
  // Assumes 'convert(x)' is defined elsewhere
  calcForm.elements.y.value = convert(inputValue);
};
