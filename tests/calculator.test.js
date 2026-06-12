const { evaluateExpression, convertUnit } = require("../src/calculator");

describe("evaluateExpression", () => {
  it("adds two numbers", () => {
    expect(evaluateExpression("2+3")).toBe(5);
  });

  it("subtracts two numbers", () => {
    expect(evaluateExpression("10-4")).toBe(6);
  });

  it("multiplies two numbers", () => {
    expect(evaluateExpression("6*7")).toBe(42);
  });

  it("divides two numbers", () => {
    expect(evaluateExpression("20/4")).toBe(5);
  });

  it("respects operator precedence", () => {
    expect(evaluateExpression("2+3*4")).toBe(14);
  });

  it("handles parentheses", () => {
    expect(evaluateExpression("(2+3)*4")).toBe(20);
  });

  it("handles decimal numbers", () => {
    expect(evaluateExpression("3.5+2.5")).toBe(6);
  });

  it("throws on invalid expression", () => {
    expect(() => evaluateExpression("2&3")).toThrow();
  });

  it("throws on division by zero", () => {
    expect(() => evaluateExpression("5/0")).toThrow();
  });

  it("throws on empty string", () => {
    expect(() => evaluateExpression("")).toThrow();
  });
});

describe("convertUnit - Mass", () => {
  it("converts kg to g", () => {
    expect(convertUnit(1, "kg", "g")).toBe(1000);
  });

  it("converts lb to kg", () => {
    expect(convertUnit(1, "lb", "kg")).toBeCloseTo(0.453592, 5);
  });

  it("converts oz to g", () => {
    expect(convertUnit(1, "oz", "g")).toBeCloseTo(28.3495, 3);
  });

  it("converts tonnes to kg", () => {
    expect(convertUnit(2, "t", "kg")).toBe(2000);
  });
});

describe("convertUnit - Area", () => {
  it("converts sqkm to sqm", () => {
    expect(convertUnit(1, "sqkm", "sqm")).toBe(1000000);
  });

  it("converts acre to sqm", () => {
    expect(convertUnit(1, "acre", "sqm")).toBeCloseTo(4046.86, 2);
  });

  it("converts sqft to sqm", () => {
    expect(convertUnit(10, "sqft", "sqm")).toBeCloseTo(0.92903, 5);
  });
});

describe("convertUnit - Data Storage", () => {
  it("converts bytes to bits", () => {
    expect(convertUnit(1, "B", "b")).toBe(8);
  });

  it("converts GB to MB", () => {
    expect(convertUnit(1, "gB", "mB")).toBe(1024);
  });

  it("converts TB to GB", () => {
    expect(convertUnit(1, "tB", "gB")).toBe(1024);
  });

  it("converts kilobits to bits", () => {
    expect(convertUnit(1, "kb", "b")).toBe(1000);
  });
});

describe("convertUnit - Error handling", () => {
  it("throws on invalid value", () => {
    expect(() => convertUnit("abc", "kg", "g")).toThrow();
  });

  it("throws on incompatible units", () => {
    expect(() => convertUnit(1, "kg", "sqm")).toThrow();
  });
});
