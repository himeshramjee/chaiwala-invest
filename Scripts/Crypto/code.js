// NB: Not for production use!
// ========================================================================

// https://thegraph.com/hosted-service/subgraph/uniswap/uniswap-v3
function getUniSwapPrice(symbol) {
  const uniswapGraphEndpoint =
    "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

  const ethPriceQuery = `
    query bundles {
      bundles(where: { id: "1" }) {
        ethPriceUSD
      }
    }`;

  const tokenPriceQuery1 = `
    query tokens {
      tokens(first: 1, 
        where: { symbol: "${symbol}" }) {
          tokenDayData {
            priceUSD
          }
        }
    }`;

  const tokenPriceQuery2 = `
    query tokenDayDatas {
      tokenDayDatas(first: 1, 
        orderBy: date, orderDirection: desc, 
        where: {
          token_: { 
            symbol: "${symbol}" 
          }
        }) 
        {
          priceUSD
        }
    }`;

  // const requestPayload = ethPriceQuery;
  // const requestPayload = tokenPriceQuery1;
  const requestPayload = tokenPriceQuery2;

  var requestOptions = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({ query: requestPayload }),
    followRedirects: false,
  };

  let response;
  try {
    Logger.log(UrlFetchApp.getRequest(uniswapGraphEndpoint, requestOptions));
    response = UrlFetchApp.fetch(uniswapGraphEndpoint, requestOptions);

    if (!response || !response.getContentText()) {
      let errMsg = "Failed to fetch data from API.";
      Logger.log(errMsg);
      return errMsg;
    }
  } catch (err) {
    response = err;
  }

  response = JSON.parse(response.getContentText());
  return response.data && response.data.tokenDayDatas
    ? response.data.tokenDayDatas[0].priceUSD
    : 0;
}

function getCryptoPrice(baseCurrency, quoteCurrency, providerShortCode) {
  if (providerShortCode && providerShortCode.toUpperCase() === "UNI") {
    // TODO: Support quoteCurrency
    return getUniSwapPrice(baseCurrency);
  }

  let providerUrl = getAPIEndpointForCryptoPrices(
    baseCurrency,
    quoteCurrency,
    providerShortCode
  );
  Logger.log(providerUrl);

  if (!providerUrl) {
    Browser.msgBox("Oops, failed to generate provider API endpoint url");
    return;
  }

  let authData = getAPIProviderAPIAuthData(providerShortCode);
  authHeaderName = authData.authKeyHeader || "x-no-auth";
  authHeaderValue = authData.authKeyValue;

  let requestParams = {
    method: "get",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      [authHeaderName]: authHeaderValue, // [authHeaderName] uses concept of computed property names and allows for dynamically setting that here
    },
    muteHttpExceptions: true,
    payload: null,
  };

  let response;
  try {
    Logger.log(UrlFetchApp.getRequest(providerUrl, requestParams));
    response = UrlFetchApp.fetch(providerUrl, requestParams);

    if (!response || !response.getContentText()) {
      let errMsg = "Failed to fetch data from API.";
      Logger.log(errMsg);
      return errMsg;
    }
  } catch (err) {
    response = err;
  }

  Logger.log(response);
  return extractPriceFromResponse(
    response,
    baseCurrency,
    quoteCurrency,
    providerShortCode
  );
}

function getSignature(queryString, secret) {
  var signature = Utilities.computeHmacSha256Signature(queryString, secret);
  signature = signature
    .map(function (e) {
      var v = (e < 0 ? e + 256 : e).toString(16);
      return v.length == 1 ? "0" + v : v;
    })
    .join("");

  return signature;
}

function getAllBinancePrices() {
  let rows = [];
  let jsonData = null;
  let msg = "";

  let url = getAPIEndpointForCryptoPrices("", "", "BIN");
  // FIXME: Hack to rip out query params
  url = url.split("?")[0];
  // UrlFetchApp.getRequest(url);
  jsonData = JSON.parse(UrlFetchApp.fetch(url).getContentText());

  if (jsonData != null) {
    for (r in jsonData) {
      rows.push([jsonData[r].symbol, parseFloat(jsonData[r].price)]);
    }

    let currentDoc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = currentDoc.getSheetByName("Binance-Data");
    currentDoc.getRange("Binance-Data!B1").setValue(new Date());

    let range;
    try {
      range = sheet.getRange(3, 1, sheet.getLastRow(), 2).clearContent();
    } catch (e) {
      Logger.log("error");
      Browser.msgBox(
        "Oops, Current data on Binance-Data sheet couldn't be cleared. \\n\\n" +
          e
      );
    }

    if (rows != "") {
      range = sheet.getRange(3, 1, rows.length, 2);
      range.setValues(rows);
    }
  }
}

function getCryptoPriceTest() {
  // Logger.log(getCryptoPrice("RVF", "USD", "cmc"));
  // Logger.log(getCryptoPrice("BTC", "USDT", "bin"));
  // Logger.log(getCryptoPrice("BTC", "USDT", "cro"));
  // Logger.log(getCryptoPrice("BTC", "USDT", "val"));
  // Logger.log(getCryptoPrice("XRP", "BTC", "byb"));
  // Logger.log(getCryptoPrice("BTC", "USDT", "okx"));
  // Logger.log(getCryptoPrice("BTC", "USDT", "kuc"));
  // Logger.log(getCryptoPrice("OCTO", "USDT", "gat"));
  // Logger.log(getCryptoPrice("BTC", "USDT", "mexc"));
  Logger.log(getCryptoPrice("BTC", "USDT", "uni"));
}

function getAllBinancePricesTest() {
  getAllBinancePrices();
}

function getUniSwapPriceTest() {
  Logger.log(getUniSwapPrice("RVF"));
}
