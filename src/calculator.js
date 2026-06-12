"use strict";

/**
 * Evaluates a mathematical expression safely (no eval)
 */
function evaluateExpression(expr) {
  if (!expr || typeof expr !== "string") {
    throw new Error("Invalid expression");
  }

  // Tokenize: split into numbers, operators, parentheses
  const tokens = expr.match(/(\d+\.?\d*|\+|\-|\*|\/|\(|\))/g);
  if (!tokens) throw new Error("Invalid expression");

  // Shunting-yard algorithm to convert to RPN
  const output = [];
  const operators = [];
  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 };
  const isLeftAssoc = { "+": true, "-": true, "*": true, "/": true };

  for (const token of tokens) {
    if (/^\d+\.?\d*$/.test(token)) {
      output.push(parseFloat(token));
    } else if (token === "(") {
      operators.push(token);
    } else if (token === ")") {
      while (operators.length && operators[operators.length - 1] !== "(") {
        output.push(operators.pop());
      }
      operators.pop(); // Remove '('
    } else {
      while (
        operators.length &&
        operators[operators.length - 1] !== "(" &&
        precedence[operators[operators.length - 1]] >= precedence[token]
      ) {
        output.push(operators.pop());
      }
      operators.push(token);
    }
  }

  while (operators.length) {
    output.push(operators.pop());
  }

  // Evaluate RPN
  const stack = [];
  for (const token of output) {
    if (typeof token === "number") {
      stack.push(token);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined)
        throw new Error("Invalid expression");
      switch (token) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          if (b === 0) throw new Error("Division by zero");
          stack.push(a / b);
          break;
      }
    }
  }

  const result = stack[0];
  if (isNaN(result) || !isFinite(result)) throw new Error("Invalid result");
  return result;
}

// ===============================
// UNIT CONVERTER FEATURE
// ===============================

const UNIT_RATES = {
  mass: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.453592,
    oz: 0.0283495,
    st: 6.35029,
    t: 1000,
  },
  area: {
    sqm: 1,
    sqkm: 1000000,
    sqft: 0.092903,
    sqin: 0.00064516,
    acre: 4046.86,
    ha: 10000,
  },
  data: {
    b: 1,
    B: 8,
    kb: 1000,
    kB: 8000,
    mb: 1000000,
    mB: 8000000,
    gb: 1000000000,
    gB: 8000000000,
    tb: 1000000000000,
    tB: 8000000000000,
  },
};

/**
 * Converts a value from one unit to another
 * @param {number} value - The value to convert
 * @param {string} from - Source unit (e.g., 'kg', 'lb', 'sqm', 'gb')
 * @param {string} to - Target unit
 * @returns {number} - Converted value
 */
function convertUnit(value, from, to) {
  if (typeof value !== "number" || isNaN(value)) {
    throw new Error("Value must be a valid number");
  }

  // Find which category the units belong to
  let category = null;
  for (const [cat, units] of Object.entries(UNIT_RATES)) {
    if (units[from] !== undefined && units[to] !== undefined) {
      category = cat;
      break;
    }
  }

  if (!category) {
    throw new Error(`Incompatible units: ${from} and ${to}`);
  }

  // Convert: value * fromRate / toRate
  const fromRate = UNIT_RATES[category][from];
  const toRate = UNIT_RATES[category][to];

  return (value * fromRate) / toRate;
}

// Export for Node.js (tests)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { evaluateExpression, convertUnit };
}
