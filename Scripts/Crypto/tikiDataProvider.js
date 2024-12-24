// NB: Not for production use! Price accuracy hasn't been checked and there's zero error handling
// As providers grow, the code will need to be refactored to make this look more like a provider pattern
// ========================================================================
const DEFAULT_SOURCE_DATA_PROVIDER_SHORT_CODE = "BYB";
const DEFAULT_AGGREGATE_DATA_PROVIDER_SHORT_CODE = "CHAI";

var aggregateDataProviders = [
  {
    name: "Chailwala Invest",
    shortCode: "CHAI",
    websiteUrl: "https://himesh.ramjee.co.za",
    apiAuthHeaderName: "x-api-key",
    apiKey: "tvIbflZFaV1PkmVdTgDnt3MQE3YJ0mvA1xgzSjJQ",
    apiEndpoint: "https://api.himesh.ramjee.co.za",
  },
];

var dataProviders = [
  {
    id: 1,
    name: "Coin Market Cap",
    shortCode: "CMC",
    websiteUrl: "https://coinmarketcap.com",
    apiEndpoint: "https://pro-api.coinmarketcap.com",
    apiRootPath: "v1/cryptocurrency",
    apiSymbolPricePath: "/quotes/latest?symbol={0}&convert={1}",
    auth: {
      apiKeyHeader: "X-CMC_PRO_API_KEY",
      apiKeyValue: "",
    },
  },
  {
    id: 2,
    name: "Coin Gecko",
    shortCode: "CG",
    websiteUrl: "https://coingecko.com",
    apiEndpoint: "https://api.coingecko.com/api",
    apiRootPath: "v3/simple",
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
    apiEndpoint: getAggregateDataProviderData().apiEndpoint, // "https://api.binance.com"
    apiRootPath: "binance",
    apiSymbolPricePath: "/price?symbol={0}{1}", // "/api/v3/ticker/price"
    auth: {
      apiKeyHeader: getAggregateDataProviderData().apiAuthHeaderName,
      apiKeyValue: getAggregateDataProviderData().apiKey,
    },
  },
  {
    id: 4,
    name: "Crypto.Com",
    shortCode: "CRO",
    websiteUrl: "https://crypto.com",
    apiEndpoint: getAggregateDataProviderData().apiEndpoint, // "https://api.crypto.com",
    apiRootPath: "cryptocom",
    apiSymbolPricePath: "/price?instrument_name={0}_{1}", // "/v2/public"
    auth: {
      apiKeyHeader: getAggregateDataProviderData().apiAuthHeaderName,
      apiKeyValue: getAggregateDataProviderData().apiKey,
    },
  },
  {
    id: 5,
    name: "Valr.com",
    shortCode: "VAL",
    websiteUrl: "https://valr.com",
    apiEndpoint: getAggregateDataProviderData().apiEndpoint, // "https://api.valr.com",
    apiRootPath: "valr",
    apiSymbolPricePath: "/price?symbol={0}{1}", // "/v1/public/{0}{1}/marketsummary",
    auth: {
      apiKeyHeader: getAggregateDataProviderData().apiAuthHeaderName,
      apiKeyValue: getAggregateDataProviderData().apiKey,
    },
  },
  {
    id: 6,
    name: "Bybit.com",
    shortCode: "BYB",
    websiteUrl: "https://bybit.com",
    apiEndpoint: getAggregateDataProviderData().apiEndpoint, // "https://api.bybit.com"
    apiRootPath: "bybit",
    apiSymbolPricePath: "/price?category=spot&symbol={0}{1}", // "/v2/public",
    auth: {
      apiKeyHeader: getAggregateDataProviderData().apiAuthHeaderName,
      apiKeyValue: getAggregateDataProviderData().apiKey,
    },
  },
  {
    id: 7,
    name: "Okx.com",
    shortCode: "OKX",
    websiteUrl: "https://okx.com",
    apiEndpoint: getAggregateDataProviderData().apiEndpoint, // "https://www.okx.com"
    apiRootPath: "okx",
    apiSymbolPricePath: "/price?symbol={0}-{1}", // "/api/v5/market/index-tickers?instId={0}-{1}",
    auth: {
      apiKeyHeader: getAggregateDataProviderData().apiAuthHeaderName,
      apiKeyValue: getAggregateDataProviderData().apiKey,
    },
  },
  {
    id: 8,
    name: "kucoin.com",
    shortCode: "KUC",
    websiteUrl: "https://kucoin.com",
    apiEndpoint: getAggregateDataProviderData().apiEndpoint, // "https://api.kucoin.com"
    apiRootPath: "kucoin",
    apiSymbolPricePath: "/price?symbol={0}-{1}", // "/api/v1/market/orderbook/level1?symbol={0}-{1}"
    auth: {
      apiKeyHeader: getAggregateDataProviderData().apiAuthHeaderName,
      apiKeyValue: getAggregateDataProviderData().apiKey,
    },
  },
  {
    id: 9,
    name: "gateio.com",
    shortCode: "GAT",
    websiteUrl: "https://gate.io",
    apiEndpoint: getAggregateDataProviderData().apiEndpoint, // "https://api.gateio.ws/"
    apiRootPath: "gateio",
    apiSymbolPricePath: "/price?currency_pair={0}_{1}", // "/api/v4/spot/tickers?currency_pair={0}_{1}"
    auth: {
      apiKeyHeader: getAggregateDataProviderData().apiAuthHeaderName,
      apiKeyValue: getAggregateDataProviderData().apiKey,
    },
  },
  {
    id: 10,
    name: "mexc.com",
    shortCode: "MEXC",
    websiteUrl: "https://mexc.com",
    apiEndpoint: getAggregateDataProviderData().apiEndpoint, // "https://api.mexc.com"
    apiRootPath: "mexc",
    apiSymbolPricePath: "/price?symbol={0}{1}", // "/api/v3/ticker/price?symbol={0}{1}"
    auth: {
      apiKeyHeader: getAggregateDataProviderData().apiAuthHeaderName,
      apiKeyValue: getAggregateDataProviderData().apiKey,
    },
  },
  {
    id: 11,
    name: "dexscreener.com",
    shortCode: "DEXS",
    websiteUrl: "https://dexscreener.com",
    apiEndpoint: getAggregateDataProviderData().apiEndpoint, // "https://api.mexc.com"
    apiRootPath: "dexs",
    apiSymbolPricePath: "https://api.dexscreener.com/latest/dex/tokens/{0}",
    auth: {
      apiKeyHeader: getAggregateDataProviderData().apiAuthHeaderName,
      apiKeyValue: getAggregateDataProviderData().apiKey,
    },
  },
  {
    id: 12,
    name: "bitget.com",
    shortCode: "BITG",
    websiteUrl: "https://bitget.com",
    apiEndpoint: getAggregateDataProviderData().apiEndpoint, // "https://api.bitget.com"
    apiRootPath: "bitg",
    apiSymbolPricePath: "/price?symbol={0}{1}", // "api/v2/spot/market/tickers?symbol=BTCUSDT",
    auth: {
      apiKeyHeader: getAggregateDataProviderData().apiAuthHeaderName,
      apiKeyValue: getAggregateDataProviderData().apiKey,
    },
  },
];

function getAPIProviderAPIAuthData(
  providerShortCode = DEFAULT_SOURCE_DATA_PROVIDER_SHORT_CODE
) {
  let authData = {};

  providerShortCode =
    !providerShortCode || providerShortCode.trim().length >= 3
      ? providerShortCode.toUpperCase()
      : DEFAULT_SOURCE_DATA_PROVIDER_SHORT_CODE;

  dataProviders.forEach((provider) => {
    if (provider.shortCode === providerShortCode) {
      authData.authKeyHeader = provider.auth.apiKeyHeader;
      authData.authKeyValue = provider.auth.apiKeyValue;
      return;
    }
  });

  return authData;
}

function getAggregateDataProviderData(
  providerShortCode = DEFAULT_AGGREGATE_DATA_PROVIDER_SHORT_CODE
) {
  let providerData = {};

  providerShortCode =
    !providerShortCode || providerShortCode.trim().length >= 3
      ? providerShortCode.toUpperCase()
      : DEFAULT_AGGREGATE_DATA_PROVIDER_SHORT_CODE;

  aggregateDataProviders.forEach((provider) => {
    if (provider.shortCode === providerShortCode) {
      providerData = provider;
      return;
    }
    if (provider.shortCode === DEFAULT_AGGREGATE_DATA_PROVIDER_SHORT_CODE) {
      // Fallback to default aggregrate provider if provider isn't supported/recognized
      providerData = provider;
    }
  });

  return providerData;
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
        "/" +
        provider.apiRootPath +
        provider.apiSymbolPricePath;
      url = url.replace("{0}", baseCurrency);
      url = url.replace("{1}", quoteCurrency);
      return;
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
  Logger.log(payload);
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
          payload.result.list.length > 0 &&
          payload.result.list[0].lastPrice
        ) {
          price = payload.result.list[0].lastPrice;
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
      case "BITG":
        if (payload && payload.data && payload.data[0]) {
          price = payload.data[0].lastPr;
        }
        break;
    }
  }

  return price;
}

function getAPIProviderAPIAuthDataTest() {
  Logger.log(getAPIProviderAPIAuthData("cmc"));
  Logger.log(getAPIProviderAPIAuthData("   ").authKeyHeader);
  Logger.log(getAPIProviderAPIAuthData("   ").authKeyValue);
}

function getAggregateDataProviderDataTest() {
  Logger.log(getAggregateDataProviderData());
  Logger.log(getAggregateDataProviderData("CHai").name);
  Logger.log(getAggregateDataProviderData("  ").apiAuthHeaderName);
}

function getAPIEndpointForCryptoPricesTest() {
  Logger.log(getAPIEndpointForCryptoPrices("ETH", "BTC", "bin"));
  // Logger.log(getAPIEndpointForCryptoPrices("ETH", "BTC", "cg"));
  // Logger.log(getAPIEndpointForCryptoPrices("ETH", "BTC", "cmc"));
  // Logger.log(getAPIEndpointForCryptoPrices("BTC", "USDT", "cro"));
  // Logger.log(getAPIEndpointForCryptoPrices("BTC", "ZAR", "CMC"));
  // Logger.log(getAPIEndpointForCryptoPrices("BTC", "ZAR", "byb"));
  // Logger.log(getAPIEndpointForCryptoPrices("BTC", "USDT", "okx"));
  // Logger.log(getAPIEndpointForCryptoPrices("BTC", "USDT", "gat"));
  // Logger.log(getAPIEndpointForCryptoPrices("BTC", "USDT", "mex"));
  // Logger.log("R 807 769,00".replace(/\s/g, ''));
}
