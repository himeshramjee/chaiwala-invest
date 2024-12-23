import { CryptoJS } from "crypto-js";
import { createHmac } from "node:crypto";

export default function generateSignature(
  timestamp,
  apiKey,
  recvWindow,
  queryString,
  apiSecret
) {
  generateCryptoSignature(
    timestamp,
    apiKey,
    recvWindow,
    queryString,
    apiSecret
  );
}

function generatePayload(
  timestamp,
  apiKey,
  recvWindow,
  queryString,
  apiSecret
) {
  // Generate HMAC SHA256 signature payload
  const payloadParts = timestamp + apiKey + recvWindow + queryString;
  // console.log("Payload: " + payload);
  const secretKey = apiSecret; // Don't CryptoJS.enc.Utf8.parse(apiSecret);
  // console.log("secretKey: " + secretKey);

  return { payloadParts: payloadParts, secretKey: secretKey };
}

function generateCyrptoUtilitiesSignature(
  timestamp,
  apiKey,
  recvWindow,
  queryString,
  apiSecret
) {
  // In Google App Script
  var payload,
    secretKey = generatePayload(
      timestamp,
      apiKey,
      recvWindow,
      queryString,
      apiSecret
    );

  signature = Utilities.computeHmacSha256Signature(payload, secretKey).reduce(
    function (str, chr) {
      chr = (chr < 0 ? chr + 256 : chr).toString(16);
      return str + (chr.length == 1 ? "0" : "") + chr;
    },
    ""
  );
}

function generateCryptoJSSignature(
  timestamp,
  apiKey,
  recvWindow,
  queryString,
  apiSecret
) {
  // const { CryptoJS } = await import('crypto-js');

  var signature;

  var payload,
    secretKey = generatePayload(
      timestamp,
      apiKey,
      recvWindow,
      queryString,
      apiSecret
    );

  try {
    // In vanilla JS / Postman
    signature = CryptoJS.HmacSHA256(payload, secretKey).toString(
      CryptoJS.enc.Hex
    );
  } catch (e) {
    console.log(e);
  }

  console.log("Signature: " + signature);

  return signature;
}

function generateCryptoSignature(
  timestamp,
  apiKey,
  recvWindow,
  queryString,
  apiSecret
) {
  var { payload, secretKey } = generatePayload(
    timestamp,
    apiKey,
    recvWindow,
    queryString,
    apiSecret
  );
  console.log(payload);
  console.log(secretKey);

  // Create a hex HMAC using SHA-256

  const digest = createHmac("sha256", secretKey)
    .update(payload, "utf8")
    .digest("hex");
  console.log("digest: " + digest);

  return digest;
}
