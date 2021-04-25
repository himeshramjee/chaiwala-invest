// NB: Not for production use!
// ========================================================================

var dataProviders = [
  {
    "id" : 1,
    "name" : "Coin Market Cap",
    "shortCode" : "CMC",
    "websiteUrl" : "https://coinmarketcap.com",
    "apiEndpoint" : "https://api.coinmarketcap.com",
    "apiRootPath" : "/v1/cryptocurrency",
    "apiSymbolPricePath" : "/quotes/latest?symbol={0}&convert={1}",
    "auth" : {
      "readOnlyKey" : "",
      "readOnlySecret" : ""
    }
  },
  {
    "id" : 2,
    "name" : "Coin Gecko",
    "shortCode" : "CG",
    "websiteUrl" : "https://coingecko.com",
    "apiEndpoint" : "https://api.coingecko.com/api",
    "apiRootPath" : "/v3/simple",
    "apiSymbolPricePath" : "/price?ids={0}&vs_currencies={1}",
    "auth" : {
      "readOnlyKey" : "",
      "readOnlySecret" : ""
    }
  },
  {
    "id" : 3,
    "name" : "Binance",
    "shortCode" : "BIN",
    "websiteUrl" : "https://binance.com",
    "apiEndpoint" : "https://apis.himesh.ramjee.co.za", // "https://api.binance.com"
    "apiRootPath" : "/binance", // "/api/v3/ticker/price"
    "apiSymbolPricePath" : "/price?symbol={0}{1}",
    "auth" : {
      "readOnlyKey" : "",
      "readOnlySecret" : ""
    }
  },
  {
    "id" : 4,
    "name" : "Crypto.Com",
    "shortCode" : "CRO",
    "websiteUrl" : "https://crypto.com",
    "apiEndpoint" : "https://api.crypto.com",
    "apiRootPath" : "/v2/public",
    "apiSymbolPricePath" : "/get-ticker?instrument_name={0}{1}",
    "auth" : {
      "readOnlyKey" : "",
      "readOnlySecret" : ""
    }
  }
];

function getAPIEndpointForCryptoPrices(baseCurrency, quoteCurrency, providerShortCode) {
  // FIXME: These are *NOT* necessarily sensible defaults! Hightlight to user.
  // baseCurrency = (baseCurrency && baseCurrency.trim().length > 0) ? baseCurrency.toUpperCase() : "BTC";
  // quoteCurrency = (quoteCurrency && quoteCurrency.trim().length > 0) ? quoteCurrency.toUpperCase() : 'USDT';
  providerShortCode = (!providerShortCode || providerShortCode.trim().length >= 0) ? providerShortCode.toUpperCase() : "BIN";

  let url= '';

  dataProviders.forEach(provider => {
    if (provider.shortCode === providerShortCode) {
      url = provider.apiEndpoint + provider.apiRootPath + provider.apiSymbolPricePath;
      url = url.replace("{0}", baseCurrency);
      url = url.replace("{1}", quoteCurrency);
    }
  });

  return url;
}

function extractPriceFromResponse(response, baseCurrency, quoteCurrency, providerShortCode) {
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
        return payload.result.data["a"];
      default:
        return "Failed to parse price data. Unsupported provider: " + providerShortCode + ".";
    }
  } else {
    return "Failed to parse price data.";
  }
}

function getAPIEndpointForCryptoPricesTest() {
  Logger.log(getAPIEndpointForCryptoPrices("ETH", "BTC", "bin"));
  Logger.log(getAPIEndpointForCryptoPrices("ETH", "BTC", "cg"));
  Logger.log(getAPIEndpointForCryptoPrices("ETH", "BTC", "cmc"));
  Logger.log(getAPIEndpointForCryptoPrices("BTC", "USDT", "cro"));
}
