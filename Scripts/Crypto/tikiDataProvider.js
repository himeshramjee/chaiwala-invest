// NB: Not for production use! Price accuracy hasn't been checked and there's zero error handling
// As providers grow, the code will need to be refactored to make this look more like a provider pattern
// ========================================================================

var dataProviders = [
  {
    id: 1,
    name: "Coin Market Cap",
    shortCode: "CMC",
    websiteUrl: "https://coinmarketcap.com",
    apiEndpoint: "https://pro-api.coinmarketcap.com",
    apiRootPath: "/v1/cryptocurrency",
    apiSymbolPricePath: "/quotes/latest?symbol={0}&convert={1}",
    auth: {
      apiKeyHeader: "X-CMC_PRO_API_KEY",
      apiKeyValue: "fd12bab1-611a-413e-8302-f01da8e381fc",
    },
  },
  {
    id: 2,
    name: "Coin Gecko",
    shortCode: "CG",
    websiteUrl: "https://coingecko.com",
    apiEndpoint: "https://api.coingecko.com/api",
    apiRootPath: "/v3/simple",
    apiSymbolPricePath: "/price?ids={0}&vs_currencies={1}",
    auth: {
      apiKeyHeader: "",
      apiKeyValue: "",
    },
  },
  {
    id: 3,
    name: "Binance",
    shortCode: "BIN",
    websiteUrl: "https://binance.com",
    apiEndpoint: "https://apis.himesh.ramjee.co.za", // "https://api.binance.com"
    apiRootPath: "/binance", // "/api/v3/ticker/price"
    apiSymbolPricePath: "/price?symbol={0}{1}",
    auth: {
      apiKeyHeader: "",
      apiKeyValue: "",
    },
  },
  {
    id: 4,
    name: "Crypto.Com",
    shortCode: "CRO",
    websiteUrl: "https://crypto.com",
    apiEndpoint: "https://apis.himesh.ramjee.co.za", // "https://api.crypto.com",
    apiRootPath: "/cryptocom", // "/v2/public",
    apiSymbolPricePath: "/price?instrument_name={0}_{1}",
    auth: {
      apiKeyHeader: "",
      apiKeyValue: "",
    },
  },
  {
    id: 5,
    name: "Valr.com",
    shortCode: "VAL",
    websiteUrl: "https://valr.com",
    apiEndpoint: "https://apis.himesh.ramjee.co.za", // "https://api.valr.com",
    apiRootPath: "/valr", // "/v1/public",
    apiSymbolPricePath: "/v1/public/{0}{1}/marketsummary",
    // apiSymbolPricePath: "/price?symbol={0}{1}",
    auth: {
      apiKeyHeader: "",
      apiKeyValue: "",
    },
  },
  {
    id: 6,
    name: "Bybit.com",
    shortCode: "BYB",
    websiteUrl: "https://bybit.com",
    apiEndpoint: "https://apis.himesh.ramjee.co.za", // "https://api.bybit.com"
    apiRootPath: "/bybit", // "/v2/public",
    apiSymbolPricePath: "/price?symbol={0}{1}",
    auth: {
      apiKeyHeader: "",
      apiKeyValue: "",
    },
  },
  {
    id: 7,
    name: "Okx.com",
    shortCode: "OKX",
    websiteUrl: "https://okx.com",
    apiEndpoint: "https://apis.himesh.ramjee.co.za", // "https://www.okx.com"
    apiRootPath: "/okx", // "api/v5/market/index-tickers?instId=BTC-USDT"
    apiSymbolPricePath: "/api/v5/market/index-tickers?instId={0}-{1}",
    // apiSymbolPricePath: "/price?symbol={0}{1}",
    auth: {
      apiKeyHeader: "",
      apiKeyValue: "",
    },
  },
  {
    id: 8,
    name: "kucoin.com",
    shortCode: "KUC",
    websiteUrl: "https://kucoin.com",
    apiEndpoint: "https://apis.himesh.ramjee.co.za", // "https://api.kucoin.com"
    apiRootPath: "/kucoin", // "/api/v1/market/orderbook/level1?symbol=BTC-USDT"
    // apiSymbolPricePath: "/api/v1/market/orderbook/level1?symbol={0}-{1}",
    apiSymbolPricePath: "/price?symbol={0}-{1}",
    auth: {
      apiKeyHeader: "",
      apiKeyValue: "",
    },
  },
  {
    id: 9,
    name: "gateio.com",
    shortCode: "GAT",
    websiteUrl: "https://gate.io",
    apiEndpoint: "https://apis.himesh.ramjee.co.za", // "https://api.gateio.ws/"
    apiRootPath: "/gateio", // "/api/v4/spot/tickers"
    // apiSymbolPricePath: "/api/v4/spot/tickers?currency_pair={0}_{1}",
    apiSymbolPricePath: "/price?currency_pair={0}_{1}",
    auth: {
      apiKeyHeader: "",
      apiKeyValue: "",
    },
  },
  {
    id: 10,
    name: "mexc.com",
    shortCode: "MEXC",
    websiteUrl: "https://mexc.com",
    apiEndpoint: "https://apis.himesh.ramjee.co.za", // "https://api.mexc.com"
    apiRootPath: "/mexc", // "/api/v3/ticker"
    // apiSymbolPricePath: "/api/v3/ticker/price?symbol={0}{1}",
    apiSymbolPricePath: "/api/v3/ticker/price?symbol={0}{1}",
    auth: {
      apiKeyHeader: "",
      apiKeyValue: "",
    },
  },
];

function getAPIProviderAPIAuthData(providerShortCode) {
  providerShortCode =
    !providerShortCode || providerShortCode.trim().length >= 0
      ? providerShortCode.toUpperCase()
      : "CMC";

  let authData = {
    authKeyHeader: "",
    authKeyValue: "",
  };

  dataProviders.forEach((provider) => {
    if (provider.shortCode === providerShortCode) {
      authData.authKeyHeader = provider.auth.apiKeyHeader;
      authData.authKeyValue = provider.auth.apiKeyValue;
    }
  });

  return authData;
}

function getAPIEndpointForCryptoPrices(
  baseCurrency,
  quoteCurrency,
  providerShortCode
) {
  providerShortCode =
    !providerShortCode || providerShortCode.trim().length >= 0
      ? providerShortCode.toUpperCase()
      : "BIN";

  let url = "";

  dataProviders.forEach((provider) => {
    if (provider.shortCode === providerShortCode) {
      url =
        provider.apiEndpoint +
        provider.apiRootPath +
        provider.apiSymbolPricePath;
      url = url.replace("{0}", baseCurrency);
      url = url.replace("{1}", quoteCurrency);
    }
  });

  return url;
}

function extractPriceFromResponse(
  response,
  baseCurrency,
  quoteCurrency,
  providerShortCode
) {
  let payload = JSON.parse(response.getContentText());
  let price = 0;

  if (payload) {
    switch (providerShortCode.toUpperCase()) {
      case "CMC":
        if (payload.data[baseCurrency].quote[quoteCurrency].price) {
          price = payload.data[baseCurrency].quote[quoteCurrency].price;
        }
        break;
      case "CG":
        if (payload[baseCurrency][quoteCurrency]) {
          price = payload[baseCurrency][quoteCurrency];
        }
        break;
      case "BIN":
        if (payload.price) {
          price = payload.price;
        }
        break;
      case "CRO":
        if (payload.result && payload.result.data && payload.result.data[0].l) {
          price = payload.result.data[0].l;
        }
        break;
      case "VAL":
        // price = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: quoteCurrency }).format(payload.lastTradedPrice).replace(/\s/g, '');
        if (payload.lastTradedPrice) {
          price = payload.lastTradedPrice;
        }
        break;
      case "BYB":
        if (
          payload.result &&
          payload.result.length > 0 &&
          payload.result[0].last_price
        ) {
          price = payload.result[0].last_price;
        }
        break;
      case "OKX":
        if (payload.data && payload.data.length > 0 && payload.data[0].idxPx) {
          price = payload.data[0].idxPx;
        }
        break;
      case "KUC":
        if (payload.data && payload.data.price) {
          price = payload.data.price;
        }
        break;
      case "GAT":
        if (payload[0] && payload[0].last) {
          price = payload[0].last;
        }
        break;
      case "MEXC":
        if (payload && payload) {
          price = payload.price;
        }
        break;
    }
  }

  return price;
}

function getAPIProviderAPIAuthDataTest() {
  Logger.log(getAPIProviderAPIAuthData("cmc"));
}

function getAPIEndpointForCryptoPricesTest() {
  // Logger.log(getAPIEndpointForCryptoPrices("ETH", "BTC", "bin"));
  // Logger.log(getAPIEndpointForCryptoPrices("ETH", "BTC", "cg"));
  // Logger.log(getAPIEndpointForCryptoPrices("ETH", "BTC", "cmc"));
  // Logger.log(getAPIEndpointForCryptoPrices("BTC", "USDT", "cro"));
  // Logger.log(getAPIEndpointForCryptoPrices("BTC", "ZAR", "CMC"));
  // Logger.log(getAPIEndpointForCryptoPrices("BTC", "ZAR", "byb"));
  // Logger.log(getAPIEndpointForCryptoPrices("BTC", "USDT", "okx"));
  Logger.log(getAPIEndpointForCryptoPrices("BTC", "USDT", "gat"));
  Logger.log(getAPIEndpointForCryptoPrices("BTC", "USDT", "mex"));
  // Logger.log("R 807 769,00".replace(/\s/g, ''));
}
