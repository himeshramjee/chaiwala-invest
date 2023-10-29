// NB: Not for production use!
// ========================================================================

var dataProviders = [
  {
    id: 1,
    name: "Coin Market Cap",
    shortCode: "CMC",
    websiteUrl: "https://coinmarketcap.com",
    apiEndpoint: "https://api.coinmarketcap.com",
    apiRootPath: "/v1/cryptocurrency",
    apiSymbolPricePath: "/quotes/latest?symbol={0}&convert={1}",
    auth: {
      readOnlyKey: "",
      readOnlySecret: "",
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
      readOnlyKey: "",
      readOnlySecret: "",
    },
  },
  {
    id: 3,
    name: "Binance",
    shortCode: "BIN",
    websiteUrl: "https://binance.com",
    apiEndpoint: "https://apis.himesh.ramjee.co.za", // "https://api.binance.com"
    apiRootPath: "/binance/binance", // "/api/v3/ticker/price"
    apiSymbolPricePath: "/price?symbol={0}{1}",
    auth: {
      readOnlyKey: "",
      readOnlySecret: "",
    },
  },
  {
    id: 4,
    name: "Crypto.Com",
    shortCode: "CRO",
    websiteUrl: "https://crypto.com",
    apiEndpoint: "https://apis.himesh.ramjee.co.za", // "https://api.crypto.com",
    apiRootPath: "/cryptocom/cryptocom", // "/v2/public",
    apiSymbolPricePath: "/price?instrument_name={0}_{1}",
    auth: {
      readOnlyKey: "",
      readOnlySecret: "",
    },
  },
  {
    id: 5,
    name: "Valr.com",
    shortCode: "VAL",
    websiteUrl: "https://valr.com",
    apiEndpoint: "https://apis.himesh.ramjee.co.za", // "https://api.valr.com",
    apiRootPath: "/valr/valr", // "/v1/public",
    apiSymbolPricePath: "/v1/public/{0}{1}/marketsummary",
    // apiSymbolPricePath: "/price?symbol={0}{1}",
    auth: {
      readOnlyKey: "",
      readOnlySecret: "",
    },
  },
  {
    id: 5,
    name: "Bybit.com",
    shortCode: "BYB",
    websiteUrl: "https://bybit.com",
    apiEndpoint: "https://apis.himesh.ramjee.co.za", // "https://api.bybit.com"
    apiRootPath: "/bybit/bybit", // "/v2/public",
    apiSymbolPricePath: "/price?symbol={0}{1}",
    auth: {
      readOnlyKey: "",
      readOnlySecret: "",
    },
  },
];

function getAPIEndpointForCryptoPrices(
  baseCurrency,
  quoteCurrency,
  providerShortCode
) {
  // FIXME: These are *NOT* necessarily sensible defaults! Hightlight to user.
  // baseCurrency = (baseCurrency && baseCurrency.trim().length > 0) ? baseCurrency.toUpperCase() : "BTC";
  // quoteCurrency = (quoteCurrency && quoteCurrency.trim().length > 0) ? quoteCurrency.toUpperCase() : 'USDT';
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

  if (payload) {
    switch (providerShortCode.toUpperCase()) {
      case "CMC":
        return payload[0]["price_" + quoteCurrency];
      case "CG":
        return payload[baseCurrency][quoteCurrency];
      case "BIN":
        return payload.price;
      case "CRO":
        return payload.result.data[0].l;
      case "VAL":
        // return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: quoteCurrency }).format(payload.lastTradedPrice).replace(/\s/g, '');
        return payload.lastTradedPrice;
      case "BYB":
        return payload.result[0].last_price;
      default:
        return (
          "Failed to parse price data. Unsupported provider: " +
          providerShortCode +
          "."
        );
    }
  } else {
    return "Failed to parse price data.";
  }
}

function getAPIEndpointForCryptoPricesTest() {
  /*
  Logger.log(getAPIEndpointForCryptoPrices("ETH", "BTC", "bin"));
  Logger.log(getAPIEndpointForCryptoPrices("ETH", "BTC", "cg"));
  Logger.log(getAPIEndpointForCryptoPrices("ETH", "BTC", "cmc"));
  Logger.log(getAPIEndpointForCryptoPrices("BTC", "USDT", "cro"));
  Logger.log(getAPIEndpointForCryptoPrices("BTC", "ZAR", "CMC"));
  */
  Logger.log(getAPIEndpointForCryptoPrices("BTC", "ZAR", "byb"));

  // Logger.log("R 807 769,00".replace(/\s/g, ''));
}
