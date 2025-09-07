var maxRangeHighestBracket = 100000000000;
var taxTables = [
  // 2026 tax year (1 March 2025 - 28 February 2026)
  { taxYear: 2026, rate: 18, min: 1, max: 237100, base: 0 },
  { taxYear: 2026, rate: 26, min: 237101, max: 370500, base: 42678 },
  { taxYear: 2026, rate: 31, min: 370501, max: 512800, base: 77362 },
  { taxYear: 2026, rate: 36, min: 512801, max: 673000, base: 121475 },
  { taxYear: 2026, rate: 39, min: 673001, max: 857900, base: 179147 },
  { taxYear: 2026, rate: 41, min: 857901, max: 1817000, base: 251258 },
  { taxYear: 2026, rate: 45, min: 1817001, max: maxRangeHighestBracket, base: 644489 },

  // 2025 tax year (1 March 2024 - 28 February 2025)
  { taxYear: 2025, rate: 18, min: 1, max: 237100, base: 0 },
  { taxYear: 2025, rate: 26, min: 237101, max: 370500, base: 42678 },
  { taxYear: 2025, rate: 31, min: 370501, max: 512800, base: 77362 },
  { taxYear: 2025, rate: 36, min: 512801, max: 673000, base: 121475 },
  { taxYear: 2025, rate: 39, min: 673001, max: 857900, base: 179147 },
  { taxYear: 2025, rate: 41, min: 857901, max: 1817000, base: 251258 },
  { taxYear: 2025, rate: 45, min: 1817001, max: maxRangeHighestBracket, base: 644489 },

  // 2024 tax year (1 March 2023 - 29 February 2024)
  { taxYear: 2024, rate: 18, min: 1, max: 226000, base: 0 },
  { taxYear: 2024, rate: 26, min: 237101, max: 370500, base: 41678 },
  { taxYear: 2024, rate: 31, min: 370501, max: 512800, base: 77362 },
  { taxYear: 2024, rate: 36, min: 512801, max: 673000, base: 121475 },
  { taxYear: 2024, rate: 39, min: 673001, max: 857900, base: 179147 },
  { taxYear: 2024, rate: 41, min: 857901, max: 1817000, base: 251258 },
  { taxYear: 2024, rate: 45, min: 1817001, max: maxRangeHighestBracket, base: 644489 },

  // 2023 tax year (1 March 2022 - 28 February 2023)
  { taxYear: 2023, rate: 18, min: 1, max: 226000, base: 0 },
  { taxYear: 2023, rate: 26, min: 226001, max: 353100, base: 40680 },
  { taxYear: 2023, rate: 31, min: 353101, max: 488700, base: 73726 },
  { taxYear: 2023, rate: 36, min: 488701, max: 641400, base: 115762 },
  { taxYear: 2023, rate: 39, min: 641401, max: 817600, base: 170734 },
  { taxYear: 2023, rate: 41, min: 817601, max: 1731600, base: 239452 },
  { taxYear: 2023, rate: 45, min: 1731601, max: maxRangeHighestBracket, base: 614192 }
];

var taxBracketMin;
var taxRate;
var taxBase;
var cgtInclusionRate = 40; // 40%
var cgtExclusionValue = 40000;

function validateInput(year, income) {
  console.log("inputs - year: " + year + ", income: " + income + ".");

  var usageMsg = "Usage: GetZATax(<tax-year> 2023, <taxable-income> 1024204)";
  var usageMsgYearLimits =
    "\tBoth <tax-year> (2023-2026 only) and <taxable-income> are required.";
  var errorMsgInvalidYear =
    "Invalid input - Configured years are 2023-2026 only.";
  var errorMsgInvalidIncome =
    "Invalid input - Taxable income value is invalid.";

  if (!year || year < 2023 || year > 2026) {
    console.log(usageMsg + "\n" + usageMsgYearLimits);
    throw errorMsgInvalidYear;
  }

  if (!income || income <= 0 || income > maxRangeHighestBracket) {
    console.log(usageMsg + "\n" + usageMsgYearLimits);
    throw errorMsgInvalidIncome;
  }
}

function setTaxBracketData(year, income) {
  taxTables.forEach((row) => {
      if (row.taxYear === year) {
        if (row.min <= income && income <= row.max) {
          taxBracketMin = row.min;
          taxRate = row.rate;
          taxBase = row.base;
        }
      }
    });

    if (!taxBracketMin || !taxRate) {
    throw (
      "Couldn't calculate estimated " +
      year +
      " tax amount for income value of " +
      income
    );
  }
}

function calculateEstimatedTaxAmount(income) {
  if (taxBracketMin === 1) {
    return taxBase + (income * taxRate) / 100;
  } else {
    var previousBracketMax = taxBracketMin - 1;
    return taxBase + ((income - previousBracketMax) * taxRate) / 100;
  }
}

function GetZATaxBracketData(year, income) {
  setTaxBracketData(year, income);

  return {
    taxBase : taxBase,
    taxRate : taxRate
  }
}

function GetZATaxRate(year, income) {
  setTaxBracketData(year, income);
  return taxRate;
}

function GetZATax(year, income) {
  validateInput(year, income);
  setTaxBracketData(year, income);
  Logger.log("Using tax base: " + taxBase);
  var estimatedTaxAmount = calculateEstimatedTaxAmount(income);
  Logger.log("Estimated tax: " + estimatedTaxAmount);
  if (estimatedTaxAmount < 0) {
    throw ("Invalid tax amount for income value of " + income);
  }
  return estimatedTaxAmount;
}

function GetZACapitalGainsTax(marginalRate, gain) {
  effectiveCGTRate = (cgtInclusionRate * marginalRate) / 100;
  Logger.log("Effective CGT: " + effectiveCGTRate);
  return (gain * effectiveCGTRate / 100);
}

// ======= Tests ======= 

function cgtTest() {
  var taxableIncome = 1900000;
  GetZATaxRate(2026, taxableIncome);
  Logger.log("Taxable Income: " + taxableIncome);
  Logger.log("Marginal Tax Rate: " + taxRate);
  var result = GetZACapitalGainsTax(taxRate, 500000);
  Logger.log("CGT: " + result);
}

function getZACapitalGainsTaxTest() {
  var year = 2026;
  var result = GetZACapitalGainsTax(45, 100000);
  Logger.log("CGT: " + result);
}

function getZATaxTest_lowestBracket() {
  var year = 2026;
  console.log(
    "Tax burden for year " + year + " is calculated to be " + GetZATax(year, 173287.43747655523)
  );
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
