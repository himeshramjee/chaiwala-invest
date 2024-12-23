const CryptoJS = require("crypto-js");

function getQueryStringFromParams(queryParams) {
  return Object.keys(queryParams)
    .map((key) => `${key}=${queryParams[key]}`)
    .sort()
    .join("&");
}

function getPayloadSignature(payload) {
  // Generate HMAC SHA256 signature payload
  // const payload = CryptoJS.enc.Utf8.parse(payload.timestamp + payload.apiKey + payload.recvWindow + payload.queryString);
  const requestParams =
    payload.timestamp +
    payload.apiKey +
    payload.recvWindow +
    payload.queryString;
  const secretKey = payload.apiSecret; // CryptoJS.enc.Utf8.parse(apiSecret);
  return CryptoJS.HmacSHA256(requestParams, secretKey).toString(
    CryptoJS.enc.Hex
  );
}

function addHeaders(payload) {
  pm.request.headers.add({ key: "Content-Type", value: "application/json" });
  pm.request.headers.add({ key: "Accept-Encoding", value: "gzip, deflate" });
  pm.request.headers.add({ key: "X-BAPI-API-KEY", value: payload.apiKey });
  pm.request.headers.add({
    key: "X-BAPI-TIMESTAMP",
    value: payload.timestamp.toString(),
  });
  pm.request.headers.add({ key: "X-BAPI-SIGN", value: payload.signature });
  pm.request.headers.add({
    key: "X-BAPI-RECV-WINDOW",
    value: payload.recvWindow.toString(),
  });
}

console.log("2. GetAccountCoinBalance...");

// Build query string params and signed request
const payload = {
  timestamp: Date.now().toString(),
  apiKey: pm.variables.replaceIn("{{X-BAPI-API-KEY}}"),
  recvWindow: pm.variables.replaceIn("{{X-BAPI-RECV-WINDOW}}"),
  queryString: getQueryStringFromParams({
    coin:
      pm.request.url.query.get("coin").toUpperCase() ||
      pm.variables.replaceIn("{{bybitCoinsToQuery}}").toUpperCase(), // Coin tickers are case-sensitive
    accountType: pm.request.url.query.get("accountType"),
  }),
  apiSecret: pm.variables.replaceIn("{{X-BAPI-API-KEY-SECRET}}"),
  signature: "",
};
// console.log(payload);
payload.signature = getPayloadSignature(payload);

// Add signature to headers
addHeaders(payload);

// Add Request Params
// pm.request.addQueryParams("accountType=UNIFIED");
if (
  !pm.request.url.query.get("coin") ||
  pm.request.url.query.get("coin") === ""
) {
  // Coin tickers are case-sensitive
  pm.request.addQueryParams(
    "coin=" + pm.variables.replaceIn("{{bybitCoinsToQuery}}").toUpperCase()
  );
}
