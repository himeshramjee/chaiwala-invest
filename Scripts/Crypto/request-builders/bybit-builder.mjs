import bybitProviderAPIConfig from "../exchange-configs/bybit-config.mjs";
import { createHmac } from "crypto";

export default function buildBybitRequest(queryParams) {
  return generateCryptoSignature(queryParams);
}

function generateCryptoSignature(queryParams) {
  var { url, payload, secretKey } = getRequestData(queryParams);

  // Create a hex HMAC using SHA-256

  // #============ Method 1 ============
  // https://bybit-exchange.github.io/docs/v5/error
  // 10004	Error sign, please check your signature generation algorithm.
  const digest = createHmac("sha256", secretKey).update(payload).digest("hex");
  const headers = buildHeaders(digest);

  // #============ Method 2 (better supported) ============
  // # https://github.com/tiagosiebler/bybit-api/issues/321
  /**
  const encoder = new TextEncoder();
  const signature = await crypto.subtle
    .importKey(
      "raw",
      encoder.encode(apiSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    )
    .then(
      async (key) =>
        await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
    )
    .then((buffer) =>
      Array.from(new Uint8Array(buffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
    );
  // console.log("signature: " + signature);
  if (digest !== signature) {
    console.error("******Digest mismatch!******");
    console.error(digest + " vs " + signature);
  }
  */

  return { url, headers };
}

// Generate HMAC SHA256 signature payload
function getRequestData(queryStringParams) {
  const timestamp = bybitProviderAPIConfig.timestamp;
  const apiKey = bybitProviderAPIConfig.apiKey;
  const recvWindow = bybitProviderAPIConfig.recvWindow;
  const apiSecret = bybitProviderAPIConfig.apiKeySecret;
  const queryParams = builQueryString(queryStringParams);
  const url =
    bybitProviderAPIConfig.url +
    bybitProviderAPIConfig.pathAllCoinsBalance +
    "?" +
    queryParams;

  // This ordering is important per the documentation: https://bybit-exchange.github.io/docs/v5/guide
  // "# rule: timestamp+api_key+recv_window+queryString"
  const payloadParts = timestamp + apiKey + recvWindow + queryParams;
  const secretKey = apiSecret; // Don't CryptoJS.enc.Utf8.parse(apiSecret);

  return { url: url, payload: payloadParts, secretKey: secretKey };
}

function builQueryString(queryParams) {
  return Object.keys(queryParams)
    .sort()
    .map((key) => `${key}=${queryParams[key]}`)
    .join("&");
}

function buildHeaders(digest) {
  return {
    "X-BAPI-API-KEY": bybitProviderAPIConfig.apiKey,
    "X-BAPI-TIMESTAMP": bybitProviderAPIConfig.timestamp,
    "X-BAPI-RECV-WINDOW": bybitProviderAPIConfig.recvWindow,
    "X-BAPI-SIGN": digest,
  };
}
