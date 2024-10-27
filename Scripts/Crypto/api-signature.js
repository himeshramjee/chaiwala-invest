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
      timestamp + apiKey + recvWindow + JSON.stringify(requestData),
      apiKeySecret,
      Utilities.Charset.UTF_8
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

function main() {
  var hmacSignature = generateSignature(
    sampleRequestData,
    bybitProviderAPIConfig.apiKeySecret,
    bybitProviderAPIConfig.apiKey
  );

  Logger.log("Your brand spanking new sig: " + hmacSignature);
}
