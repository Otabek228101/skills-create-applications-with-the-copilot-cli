#!/usr/bin/env node

// Supported operations: addition (+), subtraction (-), multiplication (*), and division (/).
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
    default:
      throw new Error(`Unsupported operation "${operator}". Use +, -, *, or /.`);
  }
}

function main(args) {
  if (args.length !== 3) {
    throw new Error("Usage: node src/calculator.js <number> <+|-|*|/> <number>");
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

module.exports = { calculate };
