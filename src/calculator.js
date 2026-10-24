#!/usr/bin/env node

function modulo(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new TypeError("Operands must be finite numbers.");
  }
  if (b === 0) {
    throw new RangeError("Cannot modulo by zero.");
  }
  return a % b;
}

function power(base, exponent) {
  if (!Number.isFinite(base) || !Number.isFinite(exponent)) {
    throw new TypeError("Operands must be finite numbers.");
  }
  return base ** exponent;
}

function squareRoot(n) {
  if (!Number.isFinite(n)) {
    throw new TypeError("Operand must be a finite number.");
  }
  if (n < 0) {
    throw new RangeError("Cannot calculate the square root of a negative number.");
  }
  return Math.sqrt(n);
}

// Supported operations: addition (+), subtraction (-), multiplication (*), division (/), modulo (%), and exponentiation (^).
function calculate(first, operator, second) {
  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    throw new TypeError("Operands must be finite numbers.");
  }

  switch (operator) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "*":
      return first * second;
    case "/":
      if (second === 0) {
        throw new RangeError("Cannot divide by zero.");
      }
      return first / second;
    case "%":
      return modulo(first, second);
    case "^":
      return power(first, second);
    default:
      throw new Error(`Unsupported operation "${operator}". Use +, -, *, /, %, or ^.`);
  }
}

function main(args) {
  if (args.length === 2 && args[0] === "sqrt") {
    if (args[1].trim() === "") {
      throw new TypeError("Operand must be a finite number.");
    }
    console.log(squareRoot(Number(args[1])));
    return;
  }

  if (args.length !== 3) {
    throw new Error("Usage: node src/calculator.js <number> <+|-|*|/|%|^> <number> or sqrt <number>");
  }

  const [firstInput, operator, secondInput] = args;
  if (firstInput.trim() === "" || secondInput.trim() === "") {
    throw new TypeError("Operands must be finite numbers.");
  }

  const result = calculate(Number(firstInput), operator, Number(secondInput));
  console.log(result);
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { calculate, modulo, power, squareRoot };
