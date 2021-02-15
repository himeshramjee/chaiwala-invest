var taxBrackets = [
  { min: 1, max: 205900 },
  { min: 205901, max: 321600 },
  { min: 321601, max: 445100 },
  { min: 445101, max: 584200 },
  { min: 584201, max: 744800 },
  { min: 744801, max: 1577300 },
  { min: 1577301, max: 100000000 },
];

var taxBracketsRates = [
  { key: 1, rate: 18 },
  { key: 205901, rate: 26 },
  { key: 321601, rate: 31 },
  { key: 445101, rate: 36 },
  { key: 584201, rate: 39 },
  { key: 744801, rate: 41 },
  { key: 1577301, rate: 45 },
];

var taxBracketsBase = [
  { key: 1, base: 0 },
  { key: 205901, base: 37062 },
  { key: 321601, base: 67144 },
  { key: 445101, base: 105429 },
  { key: 584201, base: 155505 },
  { key: 744801, base: 218139 },
  { key: 1577301, base: 559464 },
];

var taxBracketMin;
var taxRate;
var taxBase;

function GetZATax(income) {
  var estimatedTaxAmount;

  taxBrackets.forEach(function (bracket) {
    if (bracket.min <= income && income <= bracket.max) {
      taxBracketMin = bracket.min;
    }
  });

  Logger.log("Using bracket key: " + taxBracketMin);
  taxBracketsRates.forEach(function (rates) {
    if (rates.key === taxBracketMin) {
      taxRate = rates.rate;
    }
  });

  Logger.log("Using tax rate: " + taxRate);
  taxBracketsBase.forEach(function (bracketBase) {
    if (bracketBase.key === taxBracketMin) {
      taxBase = bracketBase.base;
    }
  });

  Logger.log("Using tax base: " + taxBase);

  if (taxBracketMin === 1) {
    estimatedTaxAmount = taxBase + (income * taxRate) / 100;
  } else {
    var previousBracketMax = taxBracketMin - 1;
    estimatedTaxAmount =
      taxBase + ((income - previousBracketMax) * taxRate) / 100;
  }

  if (estimatedTaxAmount <= 0) {
    throw (
      "Couldn't calculate estimated tax amount for income value of " + income
    );
  }

  Logger.log("Estimated tax: " + estimatedTaxAmount);
  return estimatedTaxAmount;
}
