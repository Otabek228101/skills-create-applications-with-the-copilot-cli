const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const test = require("node:test");

const { calculate, modulo, power, squareRoot } = require("../calculator");
const calculatorPath = path.join(__dirname, "..", "calculator.js");

test("addition supports the image example and negative operands", () => {
  assert.equal(calculate(2, "+", 3), 5);
  assert.equal(calculate(-2, "+", 3), 1);
});

test("subtraction supports the image example and negative results", () => {
  assert.equal(calculate(10, "-", 4), 6);
  assert.equal(calculate(4, "-", 10), -6);
});

test("multiplication supports the image example and signed operands", () => {
  assert.equal(calculate(45, "*", 2), 90);
  assert.equal(calculate(-3, "*", 2), -6);
});

test("division supports the image example and fractional results", () => {
  assert.equal(calculate(20, "/", 5), 4);
  assert.equal(calculate(7, "/", 2), 3.5);
});

test("modulo returns the remainder and rejects division by zero", () => {
  assert.equal(modulo(5, 2), 1);
  assert.equal(modulo(7, 3), 1);
  assert.equal(calculate(5, "%", 2), 1);
  assert.throws(() => modulo(1, 0), {
    name: "RangeError",
    message: "Cannot modulo by zero.",
  });
});

test("power raises the base to the exponent", () => {
  assert.equal(power(2, 3), 8);
  assert.equal(calculate(2, "^", 3), 8);
  assert.equal(power(2, -1), 0.5);
});

test("square root returns the root and rejects negative numbers", () => {
  assert.equal(squareRoot(16), 4);
  assert.equal(squareRoot(9), 3);
  assert.equal(squareRoot(0), 0);
  assert.throws(() => squareRoot(-1), {
    name: "RangeError",
    message: "Cannot calculate the square root of a negative number.",
  });
});

test("division by zero throws a clear RangeError", () => {
  assert.throws(() => calculate(1, "/", 0), {
    name: "RangeError",
    message: "Cannot divide by zero.",
  });
  assert.throws(() => calculate(1, "/", -0), RangeError);
});

test("unsupported operations throw a descriptive error", () => {
  assert.throws(() => calculate(1, "&", 2), {
    message: 'Unsupported operation "&". Use +, -, *, /, %, or ^.',
  });
});

test("non-finite operands are rejected", () => {
  for (const value of [NaN, Infinity, -Infinity]) {
    assert.throws(() => calculate(value, "+", 1), {
      name: "TypeError",
      message: "Operands must be finite numbers.",
    });
    assert.throws(() => calculate(1, "+", value), TypeError);
  }
});

test("CLI prints the result for a valid calculation", () => {
  const result = spawnSync(
    process.execPath,
    [calculatorPath, "2", "+", "3"],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "5\n");
  assert.equal(result.stderr, "");
});

test("CLI supports modulo, power, and square root", () => {
  for (const [args, expected] of [
    [["5", "%", "2"], "1\n"],
    [["2", "^", "3"], "8\n"],
    [["sqrt", "16"], "4\n"],
  ]) {
    const result = spawnSync(process.execPath, [calculatorPath, ...args], {
      encoding: "utf8",
    });
    assert.equal(result.status, 0);
    assert.equal(result.stdout, expected);
    assert.equal(result.stderr, "");
  }
});

test("CLI reports a negative square root and exits unsuccessfully", () => {
  const result = spawnSync(process.execPath, [calculatorPath, "sqrt", "-1"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(
    result.stderr,
    "Cannot calculate the square root of a negative number.\n",
  );
});

test("CLI reports division by zero and exits unsuccessfully", () => {
  const result = spawnSync(
    process.execPath,
    [calculatorPath, "1", "/", "0"],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "Cannot divide by zero.\n");
});

test("CLI rejects missing arguments with usage guidance", () => {
  const result = spawnSync(process.execPath, [calculatorPath], {
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /^Usage: node src\/calculator\.js/);
});
