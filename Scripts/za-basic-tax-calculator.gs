var taxBrackets = [
  {min: 1, max: 195850}
  , {min: 195851, max: 305850}
  , {min: 305851, max: 423300}
  , {min: 423301, max: 555600}
  , {min: 555601, max: 708310}
  , {min: 708311, max: 1500000}
  , {min: 1500001, max: 100000000}
];
     
var taxBracketsRates = [
  {key: 1, rate: 18}
  , {key: 195851, rate: 26}
  , {key: 305851, rate: 31}
  , {key: 423301, rate: 36}
  , {key: 555601, rate: 39}
  , {key: 708311, rate: 41}
  , {key: 1500001, rate: 45}
];
     
var taxBracketsBase = [
  {key: 1, base: 0}
   , {key: 195851, base: 35253}
   , {key: 305851, base: 63853}
   , {key: 423301, base: 100263}
   , {key: 555601, base: 147891}
   , {key: 708311, base: 207448}
   , {key: 1500001, base: 532041}
];

var taxBracketMin;
var taxRate;
var taxBase;

function GetZATax(income) {                           
  var estimatedTaxAmount;
  
  taxBrackets.forEach(function(bracket) {
    if ((bracket.min <= income) && (income <= bracket.max)) {
      taxBracketMin = bracket.min;
    }
  });
  
  Logger.log("Using bracket key: " + taxBracketMin);
  taxBracketsRates.forEach(function(rates) {
    if (rates.key === taxBracketMin) {
      taxRate = rates.rate;
    }
  });
  
  Logger.log("Using tax rate: " + taxRate);
  taxBracketsBase.forEach(function(bases) {
    if (bases.key === taxBracketMin) {
      taxBase = bases.base;
    }
  });
  
  Logger.log("Using tax base: " + taxBase);
  
  if (taxBracketMin === 1) {
    estimatedTaxAmount = taxBase + (income * taxRate / 100);
  } else {
    var previousBracketMax = taxBracketMin - 1;
    estimatedTaxAmount = taxBase + ((income - previousBracketMax) * taxRate / 100);
  }
  
  if (estimatedTaxAmount <= 0) {
    throw ("Couldn't calculate estimated tax amount for income value of " + income);
  }
  
  return estimatedTaxAmount;
}

