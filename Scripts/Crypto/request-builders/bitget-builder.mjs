import { bitgetProviderAPIConfig } from "../provider-configs/bitget-config.mjs";
import { createHmac } from "crypto";

export default function buildBitgetRequest(queryParams, apiPath) {
  return generateCryptoSignature(queryParams, apiPath);
}

function generateCryptoSignature(queryParams, apiPath) {
  var { url, payload, secretKey } = buildGetRequestData(queryParams, apiPath);

  // Create a hex HMAC using SHA-256
  const digest = createHmac("sha256", secretKey)
    .update(payload)
    .digest("base64");

  const headers = buildHeaders(digest);

  return { url, headers };
}

// Generate HMAC SHA256 signature payload
function buildGetRequestData(queryStringParams, apiPath) {
  // FIXME: Dirty! .coin
  const hasQueryString = queryStringParams?.coin?.length > 0;
  const timestamp = bitgetProviderAPIConfig.timestamp;
  const apiSecret = bitgetProviderAPIConfig.apiSecret;
  const queryParams = buildQueryString(queryStringParams);
  const url = bitgetProviderAPIConfig.url + apiPath + "?" + queryParams;

  // This ordering is important per the documentation: https://www.bitget.com/api-doc/common/signature
  const payloadParts =
    timestamp + "GET" + apiPath + (hasQueryString ? `?${queryParams}` : "");

  return { url: url, payload: payloadParts, secretKey: apiSecret };
}

function buildQueryString(queryParams) {
  if (queryParams) {
    return Object.keys(queryParams)
      .sort()
      .map(
        (key) =>
          `${key}=${encodeURIComponent(queryParams[key]?.replace(/\s/g, ""))}`
      )
      .join("&");
  } else {
    return "";
  }
}

function buildHeaders(digest) {
  return {
    "ACCESS-KEY": bitgetProviderAPIConfig.apiKey,
    "ACCESS-SIGN": digest,
    "ACCESS-TIMESTAMP": bitgetProviderAPIConfig.timestamp,
    "ACCESS-PASSPHRASE": bitgetProviderAPIConfig.apiAccessPassphrase,
    locale: "en-US",
    "Content-Type": "application/json",
  };
}
