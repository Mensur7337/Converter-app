// Unit system: convert -> base unit -> target unit
const units = {
    mass: [ // base unit: kilogram
        { name: "Kilogram", symbol: "kg", toBase: v => v,           fromBase: v => v },
        { name: "Gram",     symbol: "g",  toBase: v => v / 1000,    fromBase: v => v * 1000 },
        { name: "Pound",    symbol: "lb", toBase: v => v * 0.453592,fromBase: v => v / 0.453592 }
    ],
    length: [ // base unit: meter
        { name: "Meter",      symbol: "m",  toBase: v => v,        fromBase: v => v },
        { name: "Centimeter", symbol: "cm", toBase: v => v / 100,  fromBase: v => v * 100 },
        { name: "Feet",       symbol: "ft", toBase: v => v * 0.3048,fromBase: v => v / 0.3048 },
        { name: "Inch",       symbol: "in", toBase: v => v * 0.0254,fromBase: v => v / 0.0254 }
    ],
    temperature: [ // base unit: celsius
        { name: "Celsius",    symbol: "°C", toBase: v => v,              fromBase: v => v },
        { name: "Fahrenheit", symbol: "°F", toBase: v => (v - 32) * 5/9,  fromBase: v => v * 9/5 + 32 },
        { name: "Kelvin",     symbol: "K",  toBase: v => v - 273.15,      fromBase: v => v + 273.15 }
    ],
    volume: [ // base unit: liter
        { name: "Liter",      symbol: "L",  toBase: v => v,        fromBase: v => v },
        { name: "Milliliter", symbol: "mL", toBase: v => v / 1000, fromBase: v => v * 1000 },
        { name: "Gallon (US)",symbol: "gal",toBase: v => v * 3.78541, fromBase: v => v / 3.78541 }
    ],
    time: [ // base unit: second
        { name: "Hour",   symbol: "h",   toBase: v => v * 3600, fromBase: v => v / 3600 },
        { name: "Minute", symbol: "min", toBase: v => v * 60,   fromBase: v => v / 60 },
        { name: "Second", symbol: "s",   toBase: v => v,        fromBase: v => v }
    ]
};

// UI elements
const categorySelect = document.getElementById("category");
const fromUnitSelect = document.getElementById("fromUnit");
const toUnitSelect   = document.getElementById("toUnit");
const inputValue     = document.getElementById("inputValue");
const mainResultDiv  = document.getElementById("mainResult");
const resultsDiv     = document.getElementById("results");

// Update unit options when category changes
function updateUnitOptions() {
    const cat = categorySelect.value;
    fromUnitSelect.innerHTML = "";
    toUnitSelect.innerHTML = "";

    units[cat].forEach((unit, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${unit.name} (${unit.symbol})`;
        fromUnitSelect.appendChild(option);
        toUnitSelect.appendChild(option.cloneNode(true));
    });

    toUnitSelect.value = 1;
    convert();
}

// Convert value
function convert() {
    const cat = categorySelect.value;
    const fromIdx = Number(fromUnitSelect.value);
    const toIdx = Number(toUnitSelect.value);
    const value = Number(inputValue.value);

    mainResultDiv.innerHTML = "";
    resultsDiv.innerHTML = "";

    if (isNaN(value)) return;

    const fromUnit = units[cat][fromIdx];
    const baseValue = fromUnit.toBase(value);

    if (cat === "temperature" && baseValue < -273.15) {
        mainResultDiv.innerHTML = `<div style="color:red">Invalid temperature value</div>`;
        return;
    }

    const toUnit = units[cat][toIdx];
    const mainResult = toUnit.fromBase(baseValue);
    const roundedMain = Number(mainResult.toFixed(4));

    mainResultDiv.innerHTML =
        `<strong>${value} ${fromUnit.symbol} = ${roundedMain} ${toUnit.symbol}</strong>`;

    units[cat].forEach((unit, i) => {
        if (i === fromIdx || i === toIdx) return;

        const result = unit.fromBase(baseValue);
        const rounded = Number(result.toFixed(4));

        const item = document.createElement("div");
        item.className = "result-item";
        item.innerHTML = `<strong>${rounded} ${unit.symbol}</strong> (${unit.name})`;
        resultsDiv.appendChild(item);
    });
}

// Events
categorySelect.addEventListener("change", updateUnitOptions);
fromUnitSelect.addEventListener("change", convert);
toUnitSelect.addEventListener("change", convert);
inputValue.addEventListener("input", convert);

// Init
updateUnitOptions();
