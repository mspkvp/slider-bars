// Configure slider
const sliderProps = {
  startValue: 10,
  min: 0,
  max: 100,
  step: 1,
  baseBarSpace: 85,
  availableBarSpace: 210 // in px, it should be ~23% of the component's total width; At 210px the content width would be ~900px.
};

function nFormatter(num, digits) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

function calculateSavingsMRI(baseValue) {
  // 375 x number of re-scans per week x 52
  return (baseValue && 375 * baseValue * 52) || 0;
}

function calculateSavingsCT(baseValue) {
  // 150 x number of re-scans per week x 52
  return (baseValue && 150 * baseValue * 52) || 0;
}

function sliderUpdate(sliderInputValue) {
  const effectiveValue = sliderInputValue || 0;
  document.getElementById("sliderValue").textContent = effectiveValue; // change slider display value
  document.getElementById("sliderBar").style.width = `${(effectiveValue / sliderProps.max) * 100}%`; // change colored progress on slider

  updateBars(effectiveValue);
}

function updateBars(sliderValue) {
  // MRI
  const savingsMRI = calculateSavingsMRI(sliderValue);
  document.querySelector(".bar-mri .bar-value").textContent = nFormatter(savingsMRI, 3);
  document.querySelector(".bar-mri .bar-value").style.width = `${sliderProps.baseBarSpace + (savingsMRI / sliderProps.maxBarValue) * sliderProps.effectiveBarSpace}px`;

  // CT
  const savingsCT = calculateSavingsCT(sliderValue);
  document.querySelector(".bar-ct .bar-value").textContent = nFormatter(savingsCT, 3);
  document.querySelector(".bar-ct .bar-value").style.width = `${sliderProps.baseBarSpace + (savingsCT / sliderProps.maxBarValue) * sliderProps.effectiveBarSpace}px`;
}

(function main() {
  // Apply slider configs
  const sliderElement = document.getElementById("sliderInput");
  sliderElement.min = sliderProps.min;
  sliderElement.max = sliderProps.max;
  sliderElement.value = sliderProps.startValue;

  sliderProps.maxBarValue = calculateSavingsMRI(sliderProps.max); // MRI bar will always have a higher value
  sliderProps.effectiveBarSpace = sliderProps.availableBarSpace - sliderProps.baseBarSpace;

  document.getElementById("sliderInput");
  // Propagate initial changes
  sliderUpdate(sliderProps.startValue);
})();
