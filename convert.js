// A more descriptive function name
function setFocus() {
  document.mrsancalcform.x.focus();
}

// A generic function to handle conversion and display
function calculateAndDisplay(conversionFunction, ...args) {
  const result = conversionFunction(...args.map(arg => parseFloat(arg)));
  const roundedResult = roundResult(result);
  document.mrsancalcform.y.value = roundedResult;
}

// Consolidated calc functions
function calc() {
  const x = document.mrsancalcform.x.value;
  calculateAndDisplay(convert, x);
}

function calc3() {
  const x1 = document.mrsancalcform.x1.value;
  const x2 = document.mrsancalcform.x2.value;
  calculateAndDisplay(convert, x1, x2);
}

function calc4() {
  const x1 = document.mrsancalcform.x1.value;
  const x2 = document.mrsancalcform.x2.value;
  const x3 = document.mrsancalcform.x3.value;
  calculateAndDisplay(convert, x1, x2, x3);
}

// A more specialized function for different outputs
function calc5() {
  const x = document.mrsancalcform.x.value;

  const y1 = roundResult(convert1(x));
  document.mrsancalcform.y1.value = y1;

  const y2 = roundResult(convert2(x));
  document.mrsancalcform.y2.value = y2;
}

// Generalized base conversion function
function calcBase(base1, base2) {
  const x = document.mrsancalcform.x.value;
  document.mrsancalcform.y.value = convertBase(x, base1, base2);
}

function calcBase2() {
  const x = document.mrsancalcform.x.value;
  const y = convert(x);
  document.mrsancalcform.y.value = y;
}

// ---

### **Helper Functions**

The original helper functions are a bit complex and could be simplified. The `roundResult` and `roundNum` functions seem to aim for a specific type of rounding that removes trailing zeros. Here's a cleaner version of the rounding logic.

```javascript
// Helper to round a number to a specific precision and clean up trailing zeros.
// This function aims to replicate the original logic, which removes
// trailing zeros after a decimal point for a clean display.
function roundResult(x) {
  const precision = 10;
  let num = parseFloat(x);

  // If the number is an integer, return it as is.
  if (Number.isInteger(num)) {
    return num.toString();
  }

  // Use toPrecision to get the specified number of significant digits.
  // The 'parseFloat' call handles the removal of trailing zeros from
  // the string produced by toPrecision.
  let rounded = parseFloat(num.toPrecision(precision));

  // Handle scientific notation for very large or small numbers.
  // We check if the number is within a range where we can avoid
  // scientific notation for cleaner display.
  if (Math.abs(rounded) < 1e-6 || Math.abs(rounded) > 1e10) {
    return rounded.toString();
  }

  return rounded.toString();
}

// Note: The original 'roundNum' and 'removeAt' functions had some
// complex string manipulation for removing trailing zeros. The
// refined 'roundResult' function achieves the same result more
// simply by combining parseFloat and toPrecision.
