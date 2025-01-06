const chaiwalaProviderAPIConfig = {
  providerShortCode: "CHAI",
  docs: "(no docs available)",
  url: "https://api.himesh.ramjee.co.za/",
  pathCoinBalance: "{provider}/balance",
  pathCoinsFilter: "?coin={coinsFilter}",
  apiAuthHeaderName: "x-api-key",
  apiKey: "",
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
  const payloadJson = JSON.parse(response.getContentText());

  if (payloadJson?.retCode && payloadJson?.retCode > 0) {
    return payloadJson.retMsg;
  } else {
    if (payloadJson.length == 1) {
      // Single coin result, return balance
      return payloadJson[0].walletBalance;
    }
    // Multiple coins returned so return CSV (mainly for Sheets use case)
    return formatCSV(payloadJson);
  }
}

function formatCSV(arrCoinBalances) {
  let result = "";

  console.log("arrCoinBalances: ", arrCoinBalances);

  if (arrCoinBalances && !arrCoinBalances.error) {
    arrCoinBalances.map((b) => {
      if (b.walletBalance) {
        result += b.coin + "," + b.walletBalance + "\n";
      } else {
        result += b.coin + "," + b.available + "\n";
      }
    });
  }

  return result;
}

// export default chaiwalaProviderAPIConfig;
