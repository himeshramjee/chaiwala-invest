var bybitProviderAPIConfig = {
  providerShortCode: "BYB",
  apiEndpoint: "http://api.bybit.com/",
  tokenBalanceAPIPath: "v5/asset/transfer/query-account-coin-balance",
  apiKey: "",
  apiKeySecret: "",
};

var recvWindow = 5000;
var timestamp = Date.now().toString();
var sampleRequestData = {
  accountType: "SPOT",
  coin: "BTC",
};

function generateSignature(requestData, apiKeySecret, apiKey) {
  var signature;

  try {
    Logger.log(
      "Signature generation inputs: \n\t" +
        "timestamp: " +
        timestamp +
        "\n\tapiKey: " +
        apiKey +
        "\n\trecvWindow: " +
        recvWindow +
        "\n\trequestData: " +
        JSON.stringify(requestData) +
        "\n\tapiKeySecret: " +
        apiKeySecret +
        "\n\t"
    );
    signature = Utilities.computeHmacSha256Signature(
      timestamp + apiKey + recvWindow + requestData,
      apiKeySecret
    ).reduce(function (str, chr) {
      chr = (chr < 0 ? chr + 256 : chr).toString(16);
      return str + (chr.length == 1 ? "0" : "") + chr;
    }, "");
    Logger.log("API Call Signature: " + signature);
  } catch (err) {
    Logger.log("Failed to generate signature for API call. " + err);
  }

  return signature;
}

function callGETAPI(apiEndpoint, requestPayload, hmacSignature, apiKey) {
  var requestParams = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "X-BAPI-SIGN-TYPE": "2",
      "X-BAPI-SIGN": hmacSignature,
      "X-BAPI-API-KEY": apiKey,
      "X-BAPI-TIMESTAMP": timestamp,
      "X-BAPI-RECV-WINDOW": recvWindow.toString(),
    },
    contentType: "application/json; charset=utf-8",
    muteHttpExceptions: true,
    // payload: requestPayload,
  };

  apiEndpoint = apiEndpoint + "?" + requestPayload;
  Logger.log(UrlFetchApp.getRequest(apiEndpoint, requestParams));
  Logger.log(UrlFetchApp.fetch(apiEndpoint, requestParams));
}

var hmacSignature = generateSignature(
  sampleRequestData,
  bybitProviderAPIConfig.apiKeySecret,
  bybitProviderAPIConfig.apiKey
);

callGETAPI(
  bybitProviderAPIConfig.apiEndpoint +
    bybitProviderAPIConfig.tokenBalanceAPIPath,
  sampleRequestData,
  hmacSignature,
  bybitProviderAPIConfig.apiKey
);
