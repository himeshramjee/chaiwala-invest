const chaiwalaProviderAPIConfig = {
  providerShortCode: "CHAI",
  docs: "(no docs available)",
  url: "https://api.himesh.ramjee.co.za/",
  pathCoinBalance: "{provider}/balance",
  pathCoinsFilter: "?coin={coinsFilter}",
  apiAuthHeaderName: "x-api-key",
  apiKey: "tvIbflZFaV1PkmVdTgDnt3MQE3YJ0mvA1xgzSjJQ",
};

function getAPIEndpointForCoinsBalance(providerShortCode, coinsFilter) {
  const providerData = dataProviders.find((p) => {
    if (p.shortCode === providerShortCode) {
      return p;
    }
  });

  if (!providerData) {
    throw new Error("Failed to locate provider data.");
  }

  let coinsFilterQueryParam = "";
  if (coinsFilter) {
    // coinsFilterQueryParam = encodeURIComponent(coinsFilter.replace(/\s/g, ""));
    coinsFilterQueryParam = coinsFilter.replace(/\s/g, "");
  }

  let apiEndpoint =
    chaiwalaProviderAPIConfig.url +
    chaiwalaProviderAPIConfig.pathCoinBalance.replace(
      "{provider}",
      providerData.apiRootPath
    );
  apiEndpoint += coinsFilterQueryParam
    ? chaiwalaProviderAPIConfig.pathCoinsFilter.replace(
        "{coinsFilter}",
        coinsFilterQueryParam
      )
    : "";

  return apiEndpoint;
}

function getAPIEndpointForCoinsBalanceTest() {
  Logger.log(getAPIEndpointForCoinsBalance("BYB", "ETH"));
  Logger.log(getAPIEndpointForCoinsBalance("BYB", "ETH,SOL,KAS"));
}

function extractAllCoinsBalanceResult(response) {
  const payload = response.getContentText();

  if (payload?.retCode && payload?.retCode > 0) {
    return payload;
  } else {
    const coinCount = payload.length || 1;
    if (coinCount == 1) {
      // Single coin result, return balance
      return payload[0].walletBalance;
    }
    return payload;
  }
}

// export default chaiwalaProviderAPIConfig;
