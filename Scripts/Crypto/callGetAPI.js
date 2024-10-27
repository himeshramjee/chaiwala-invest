function callGetAPI(requestPayload, bybitProviderAPIConfig) {
  var apiEndpoint =
    bybitProviderAPIConfig.apiEndpoint +
    bybitProviderAPIConfig.tokenBalanceAPIPath;

  var requestParams = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "X-BAPI-SIGN-TYPE": "2",
      "X-BAPI-SIGN": generateSignature(
        sampleRequestData,
        bybitProviderAPIConfig.apiKeySecret,
        bybitProviderAPIConfig.apiKey
      ),
      "X-BAPI-API-KEY": bybitProviderAPIConfig.apiKey,
      "X-BAPI-TIMESTAMP": timestamp,
      "X-BAPI-RECV-WINDOW": recvWindow.toString(),
    },
    contentType: "application/json; charset=utf-8",
    muteHttpExceptions: true,
    // payload: requestPayload,
  };

  var queryString = Object.keys(requestPayload)
    .map(
      (key) =>
        encodeURIComponent(key) + "=" + encodeURIComponent(requestPayload[key])
    )
    .join("&");
  apiEndpoint = apiEndpoint + "?" + queryString; // Append query string to endpoint

  Logger.log("Generating request...");
  Logger.log("Request URL: " + apiEndpoint);

  try {
    var response = UrlFetchApp.fetch(apiEndpoint, requestParams);
    Logger.log("Response: " + response.getContentText());
  } catch (error) {
    Logger.log("Error during API call: " + error.message);
  }
}

function testCallGetAPI() {
  callGetAPI(sampleRequestData, bybitProviderAPIConfig);
}
