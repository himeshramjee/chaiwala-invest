// NB: Not for production use!
// ========================================================================

function getDEXScreenerPrice(contractID) {
  apiPriceEndpoint = "https://api.dexscreener.com/latest/dex/tokens/{0}";
}

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

function getAllCoinsBalance(providerShortCode) {
  const providerUrl = getAPIEndpointForCoinsBalance(providerShortCode);

  if (!providerUrl) {
    Browser.msgBox("Oops, failed to generate provider API endpoint url");
    return;
  }

  console.log("Provider: " + providerShortCode);
  console.log("Provider URL: " + providerUrl);

  const response = callProviderAPI(providerShortCode, providerUrl);

  console.log(response);

  return response;
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

  const response = callProviderAPI(providerShortCode, providerUrl);

  // Logger.log(response);
  return extractPriceFromResponse(
    response,
    baseCurrency,
    quoteCurrency,
    providerShortCode
  );
}

function callProviderAPI(providerShortCode, providerUrl) {
  let authData = getAPIProviderAPIAuthData(providerShortCode);
  let authHeaderName = authData.authKeyHeader;
  let authHeaderValue = authData.authKeyValue;

  let requestPayload = {};

  let requestParams = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      // [authHeaderName] uses concept of computed property names and allows for dynamically setting the header key name
      [authHeaderName]: authHeaderValue,
    },
    muteHttpExceptions: true,
    payload: requestPayload,
    validateHttpsCertificates: false,
  };

  let response;
  try {
    Logger.log(UrlFetchApp.getRequest(providerUrl, requestParams));
    response = UrlFetchApp.fetch(providerUrl, requestParams);

    if (!response || !response.getContentText()) {
      let errMsg = "Failed to fetch data from API. Missing/invalid response.";
      Logger.log(errMsg);
      Logger.log("Response: \n" + response);
      return errMsg;
    }

    return response;
  } catch (err) {
    response = err;
    return err;
  }
}

function getAllCoinsBalanceTest() {
  Logger.log(getAllCoinsBalance("BYB"));
}

function getCryptoPriceTest() {
  // Logger.log(getCryptoPrice("RVF", "USD", "cmc"));
  // Logger.log(getCryptoPrice("BTC", "USDT", "byb"));
  // Logger.log(getCryptoPrice("BTC", "USDT", "cro"));
  // Logger.log(getCryptoPrice("BTC", "USDT", "val"));
  // Logger.log(getCryptoPrice("BTC", "USDT", "okx"));
  // Logger.log(getCryptoPrice("BTC", "USDT", "kuc"));
  // Logger.log(getCryptoPrice("BTC", "USDT", "gat"));
  // Logger.log(getCryptoPrice("BTC", "USDT", "mexc"));
  // Logger.log(getCryptoPrice("GDAG", "USDT", "uni"));
  Logger.log(getCryptoPrice("BTC", "USDT", "bitg"));
}

function getUniSwapPriceTest() {
  Logger.log(getUniSwapPrice("RVF"));
}
