var maxRangeHighestBracket = 100000000000;
var taxTables = [
  { taxYear: 2024, rate: 18, min: 1, max: 226000, base: 0 },
  { taxYear: 2024, rate: 26, min: 237101, max: 370500, base: 41678 },
  { taxYear: 2024, rate: 31, min: 370501, max: 512800, base: 77362 },
  { taxYear: 2024, rate: 36, min: 512801, max: 673000, base: 121475 },
  { taxYear: 2024, rate: 39, min: 673001, max: 857900, base: 179147 },
  { taxYear: 2024, rate: 41, min: 857901, max: 1817000, base: 251258 },
  {
    taxYear: 2024,
    rate: 45,
    min: 1817001,
    max: maxRangeHighestBracket,
    base: 644489,
  },

  { taxYear: 2023, rate: 18, min: 1, max: 226000, base: 0 },
  { taxYear: 2023, rate: 26, min: 226001, max: 353100, base: 40680 },
  { taxYear: 2023, rate: 31, min: 353101, max: 488700, base: 73726 },
  { taxYear: 2023, rate: 36, min: 488701, max: 641400, base: 115762 },
  { taxYear: 2023, rate: 39, min: 641401, max: 817600, base: 170734 },
  { taxYear: 2023, rate: 41, min: 817601, max: 1731600, base: 239452 },
  {
    taxYear: 2023,
    rate: 45,
    min: 1731601,
    max: maxRangeHighestBracket,
    base: 614192,
  },
];

var taxBracketMin;
var taxRate;
var taxBase;

function GetZATax(year, income) {
  var estimatedTaxAmount;

  console.log("inputs - year: " + year + ", income: " + income + ".");

  var usageMsg = "Usage: GetZATax(<tax-year> 2023, <taxable-income> 1024204)";
  var usageMsgYearLimits =
    "\tBoth <tax-year> (2023-2024 only) and <taxable-income> are required.";
  var errorMsgInvalidYear =
    "Invalid input - Configured years are 2023-2024 only.";
  var errorMsgInvalidIncome =
    "Invalid input - Taxable income value is invalid.";

  console.log("Validating tax year...");
  if (!year || year < 2023 || year > 2024) {
    console.log(usageMsg + "\n" + usageMsgYearLimits);
    throw errorMsgInvalidYear;
  }

  console.log("Validating taxable income...");
  if (!income || income <= 0 || income > maxRangeHighestBracket) {
    console.log(usageMsg + "\n" + usageMsgYearLimits);
    throw errorMsgInvalidIncome;
  }

  taxTables.forEach((row) => {
    if (row.taxYear === year) {
      if (row.min <= income && income <= row.max) {
        taxBracketMin = row.min;
        taxRate = row.rate;
        taxBase = row.base;
      }
    }
  });

  if (!taxBracketMin || !taxRate || !taxBase) {
    throw (
      "Couldn't calculate estimated " +
      year +
      " tax amount for income value of " +
      income
    );
  }

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
      "Couldn't calculate estimated " +
      year +
      " tax amount for income value of " +
      income
    );
  }

  Logger.log("Estimated tax: " + estimatedTaxAmount);
  return estimatedTaxAmount;
}

function getZATaxTest_unknownYear() {
  var year = 2022;
  console.log(
    "Tax burden for year " + year + " is calculated to be " + GetZATax(year, 0)
  );
}

function getZATaxTest_invalidIncome() {
  var year = 2023;
  console.log(
    "Tax burden for year " + year + " is calculated to be " + GetZATax(year, -1)
  );
}

function getZATaxTest_41() {
  var year = 2023;
  console.log(
    "Tax burden for year " +
      year +
      " is calculated to be " +
      GetZATax(year, 1272600)
  );
}
