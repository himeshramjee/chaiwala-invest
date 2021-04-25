// NB: Not for production use!
// ========================================================================

function getCryptoPrice(baseCurrency, quoteCurrency, providerShortCode) {
  let providerUrl = getAPIEndpointForCryptoPrices(baseCurrency, quoteCurrency, providerShortCode);

  if (!providerUrl) {
    Browser.msgBox("Oops, failed to generate provider API endpoint url");
    return;
  }

  let requestParams = {
    'method': 'get',
    "headers" : { 
      "content-type" : "application/x-www-form-urlencoded"
      // , "X-Forwarded-For" : ""
      // , "X-MBX-APIKEY": "vWtLUVUzPu4KxyYwrLIwRxpoM9OnEMNL7KZLyTGuf58rYilLsXy9BEDB2ONk19fQ"
    },
    "muteHttpExceptions" : true,
    "payload" : null
  }
  let response;
  try {
    // Logger.log(UrlFetchApp.getRequest(providerUrl, requestParams));
    response = UrlFetchApp.fetch(providerUrl, requestParams);
    
    if (!response || !response.getContentText()) {
      let errMsg = "Failed to fetch data from API.";
      Logger.log(errMsg);
      return errMsg;
    }
  } catch(err){
    response = err;
  }
  
  // Logger.log(response);
  return extractPriceFromResponse(response, baseCurrency, quoteCurrency, providerShortCode);
}

function getSignature(queryString, secret) {
  var signature = Utilities.computeHmacSha256Signature(queryString, secret);
  signature = signature.map(function(e) {
    var v = (e < 0 ? e + 256 : e).toString(16);
    return v.length == 1 ? "0" + v : v;
  }).join("");
  
  return signature;
}

function getAllBinancePrices() {
  let rows = [];
  let jsonData = null;
  let msg = "";

  let url = getAPIEndpointForCryptoPrices('', '', "BIN");
  // FIXME: Hack to rip out query params
  url = url.split("?")[0];
  // UrlFetchApp.getRequest(url);
  jsonData = JSON.parse(UrlFetchApp.fetch(url).getContentText());

  if (jsonData != null){
    for (r in jsonData) {
      rows.push([jsonData[r].symbol, parseFloat(jsonData[r].price)]);
    }

    let currentDoc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = currentDoc.getSheetByName('Binance-Data');
    currentDoc.getRange("Binance-Data!B1").setValue(new Date());

    let range;
    try {
      range = sheet.getRange(3, 1, sheet.getLastRow() , 2).clearContent();
    } catch(e) {
      Logger.log("error");
      Browser.msgBox("Oops, Current data on Binance-Data sheet couldn't be cleared. \\n\\n" + e);
    }

    if (rows != "") {
      range = sheet.getRange(3, 1, rows.length, 2); 
      range.setValues(rows);
    }
  }
}

function getCryptoPriceTest () {
  Logger.log(getCryptoPrice("BTC", "USDT", "cro"));
}

function getAllBinancePricesTest() {
  getAllBinancePrices();
}
