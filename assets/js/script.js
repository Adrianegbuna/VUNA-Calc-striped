// ===============================
// CALCULATOR STATE
// ===============================
let currentExpression = "";
let LAST_RESULT = 0;

// ===============================
// THEME TOGGLE
// ===============================
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    btn.innerHTML = "☀️";
    btn.title = "Switch to light mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.innerHTML = "🌙";
    btn.title = "Switch to dark mode";
    localStorage.setItem("theme", "light");
  }
}

window.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  if (btn) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      btn.innerHTML = "☀️";
      btn.title = "Switch to light mode";
    } else {
      btn.innerHTML = "🌙";
      btn.title = "Switch to dark mode";
    }
  }

  // Initialize unit converter options
  updateUnitOptions();
});

// ===============================
// CALCULATOR FUNCTIONS
// ===============================
function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateResult();
}

function operatorToResult(value) {
  currentExpression += value;
  updateResult();
}

function clearResult() {
  currentExpression = "";
  updateResult();
}

function updateResult() {
  const display = document.getElementById("result");
  display.value = currentExpression || "0";
}

function calculateResult() {
  if (!currentExpression) return;

  try {
    // Use the evaluateExpression from calculator.js
    const result = evaluateExpression(currentExpression);
    LAST_RESULT = result;
    currentExpression = String(result);
    updateResult();
  } catch (e) {
    document.getElementById("result").value = "Error";
    currentExpression = "";
  }
}

// ===============================
// UNIT CONVERTER FEATURE
// ===============================

const UNIT_LABELS = {
  mass: {
    kg: "Kilograms (kg)",
    g: "Grams (g)",
    mg: "Milligrams (mg)",
    lb: "Pounds (lb)",
    oz: "Ounces (oz)",
    st: "Stones (st)",
    t: "Tonnes (t)",
  },
  area: {
    sqm: "Square Meters (m²)",
    sqkm: "Square Kilometers (km²)",
    sqft: "Square Feet (ft²)",
    sqin: "Square Inches (in²)",
    acre: "Acres",
    ha: "Hectares (ha)",
  },
  data: {
    b: "Bits (b)",
    B: "Bytes (B)",
    kb: "Kilobits (kb)",
    kB: "Kilobytes (kB)",
    mb: "Megabits (Mb)",
    mB: "Megabytes (MB)",
    gb: "Gigabits (Gb)",
    gB: "Gigabytes (GB)",
    tb: "Terabits (Tb)",
    tB: "Terabytes (TB)",
  },
};

function toggleUnitConverter() {
  const panel = document.getElementById("unit-converter");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function updateUnitOptions() {
  const category = document.getElementById("conv-category").value;
  const fromSelect = document.getElementById("conv-from");
  const toSelect = document.getElementById("conv-to");

  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";

  const units = Object.keys(UNIT_LABELS[category]);
  units.forEach((unit) => {
    const label = UNIT_LABELS[category][unit];
    fromSelect.add(new Option(label, unit));
    toSelect.add(new Option(label, unit));
  });

  // Default: select different units
  if (units.length > 1) {
    toSelect.selectedIndex = 1;
  }
}

function performUnitConversion() {
  const value = parseFloat(document.getElementById("conv-value").value);
  const from = document.getElementById("conv-from").value;
  const to = document.getElementById("conv-to").value;
  const resultDiv = document.getElementById("conv-result");

  if (isNaN(value)) {
    resultDiv.textContent = "Please enter a valid number";
    resultDiv.style.color = "#dc3545";
    return;
  }

  try {
    const result = convertUnit(value, from, to);
    // Format result: if very small or very large, use scientific notation
    let formatted;
    if (result === 0) {
      formatted = "0";
    } else if (result < 0.0001 || result > 1000000) {
      formatted = result.toExponential(4);
    } else {
      formatted = parseFloat(result.toPrecision(6)).toString();
    }

    const fromLabel = UNIT_LABELS[
      document.getElementById("conv-category").value
    ][from]
      .split("(")[0]
      .trim();
    const toLabel = UNIT_LABELS[document.getElementById("conv-category").value][
      to
    ]
      .split("(")[0]
      .trim();

    resultDiv.innerHTML = `${value} ${fromLabel} = <strong>${formatted}</strong> ${toLabel}`;
    resultDiv.style.color = "#0d6efd";
  } catch (e) {
    resultDiv.textContent = e.message;
    resultDiv.style.color = "#dc3545";
  }
}
