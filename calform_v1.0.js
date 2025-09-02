// A namespace object to prevent polluting the global scope
const Calculator = {
  // A helper function to get form elements
  getFormElements: (formName, ...elementNames) => {
    const form = document.forms[formName];
    if (!form) {
      console.error(`Form not found: ${formName}`);
      return {};
    }
    const elements = {};
    for (const name of elementNames) {
      elements[name] = form[name];
    }
    return elements;
  },

  setFocus: () => {
    const { x } = Calculator.getFormElements("calcform", "x");
    if (x) {
      x.focus();
    }
  },

  // The main calculation function (requires 'convert' logic)
  calc: () => {
    const { x, y } = Calculator.getFormElements("calcform", "x", "y");
    if (!x || !y) return;
    try {
      const result = Calculator.roundResult(Calculator.convert(x.value));
      y.value = result;
    } catch (error) {
      console.error("Calculation failed:", error);
      y.value = "Error";
    }
  },

  // Re-factored calculation functions
  calcTest: () => {
    const { x, y } = Calculator.getFormElements("calcform", "x", "y");
    if (!x || !y) return;
    try {
      const result = Calculator.roundResult1(Calculator.convert(x.value));
      y.value = result;
    } catch (error) {
      console.error("Calculation test failed:", error);
      y.value = "Error";
    }
  },

  calc3: () => {
    const { x1, x2, y } = Calculator.getFormElements("calcform", "x1", "x2", "y");
    if (!x1 || !x2 || !y) return;
    try {
      const result = Calculator.roundResult(
        Calculator.convert(x1.value, x2.value)
      );
      y.value = result;
    } catch (error) {
      console.error("Calculation 3 failed:", error);
      y.value = "Error";
    }
  },

  calc4: () => {
    const { x1, x2, x3, y } = Calculator.getFormElements("calcform", "x1", "x2", "x3", "y");
    if (!x1 || !x2 || !x3 || !y) return;
    try {
      const result = Calculator.roundResult(
        Calculator.convert(x1.value, x2.value, x3.value)
      );
      y.value = result;
    } catch (error) {
      console.error("Calculation 4 failed:", error);
      y.value = "Error";
    }
  },

  calc5: () => {
    const { x, y1, y2 } = Calculator.getFormElements("calcform", "x", "y1", "y2");
    if (!x || !y1 || !y2) return;
    try {
      y1.value = Calculator.roundResult(Calculator.convert1(x.value));
      y2.value = Calculator.roundResult(Calculator.convert2(x.value));
    } catch (error) {
      console.error("Calculation 5 failed:", error);
      y1.value = "Error";
      y2.value = "Error";
    }
  },

  // Re-factored number-to-string conversion
  numToStr: (num, precision = -1) => {
    if (typeof num !== 'number') {
      return '';
    }
    const fixedPrecision = precision < 0 ? 20 : precision;
    return num.toLocaleString(undefined, {
      minimumFractionDigits: precision < 0 ? 0 : precision,
      maximumFractionDigits: fixedPrecision,
      useGrouping: true
    }).replace('âˆ’', '-').replace(/\u00D7/g, '');
  },

  // Helper functions for rounding
  roundResult: (val) => Calculator.roundNum(parseFloat(val), 10),

  roundNum: (num, precision) => {
    const fixedNum = parseFloat(num).toFixed(precision);
    let str = String(fixedNum);
    
    if (str.includes("e")) {
        return str;
    }

    // Remove trailing zeros and decimal point
    str = str.replace(/\.?0+$/, "");
    return str;
  },

  // General utility functions
  isInt: (num) => Number.isInteger(num),
  isFloat: (num) => Number(num) === num && num % 1 !== 0,
  getOS: () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("like Mac")) return "iOS";
    return "unknown";
  },

  // UX and UI functions
  inputNumToText: () => {
    if (window.innerWidth >= 800) {
      const numberInputs = document.querySelectorAll("input[type=number]");
      numberInputs.forEach(input => {
        input.type = "text";
        input.removeAttribute("min");
        input.removeAttribute("max");
        input.removeAttribute("step");
      });
    }
  },
  
  // Re-written str2num for clarity and security.
  // This version avoids Function() and uses a simpler, safer approach.
  strToNum: (input, evaluate = true) => {
    if (!input) return 0;
    
    // Sanitize input
    let str = input.toString().trim().replace(/[^\d\s.,+\-*/]/g, '');

    // Handle locale-specific separators
    const localeDecimal = (1.1).toLocaleString().substring(1, 2);
    const localeThousands = (1000).toLocaleString().substring(1, 2);

    if (localeDecimal === ',') {
      const dotCount = (str.match(/\./g) || []).length;
      const commaCount = (str.match(/,/g) || []).length;
      
      if (dotCount === 0 && commaCount > 0) {
        str = str.replace(/,/g, '.');
      } else if (dotCount > 0 && commaCount > 0) {
        str = str.replace(new RegExp(`\\${localeThousands}`, 'g'), '').replace(localeDecimal, '.');
      }
    } else {
      str = str.replace(new RegExp(`\\${localeThousands}`, 'g'), '');
    }

    str = str.replace(/\s/g, '');

    if (!evaluate) {
      return str;
    }
    
    // Safer evaluation using a function with a known math scope
    const safeEval = (expr) => {
      // Basic support for arithmetic operators
      const ops = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
      };

      const tokens = str.match(/(\d+\.?\d*|[\+\-*/])/g);
      if (!tokens || tokens.length === 0) return 0;

      let result = parseFloat(tokens[0]);
      for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const nextNum = parseFloat(tokens[i + 1]);
        if (ops[operator]) {
          result = ops[operator](result, nextNum);
        }
      }
      return result;
    };
    
    try {
        return safeEval(str);
    } catch (e) {
        console.error("Invalid expression:", str);
        return NaN;
    }
  }
};

// Event listener for a cleaner, modern approach
document.addEventListener("DOMContentLoaded", () => {
  Calculator.inputNumToText();
});
