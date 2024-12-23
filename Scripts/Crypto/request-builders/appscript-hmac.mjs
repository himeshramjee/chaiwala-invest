function generateSignature(
  timestamp,
  apiKey,
  recvWindow,
  queryString,
  apiSecret
) {
  var signature;

  // Generate HMAC SHA256 signature payload
  const payload = timestamp + apiKey + recvWindow + queryString;
  console.log("Payload: " + payload);
  const secretKey = apiSecret; // Don't CryptoJS.enc.Utf8.parse(apiSecret);
  console.log("secretKey: " + secretKey);
  // In Google App Script
  signature = Utilities.computeHmacSha256Signature(payload, secretKey).reduce(
    function (str, chr) {
      chr = (chr < 0 ? chr + 256 : chr).toString(16);
      return str + (chr.length == 1 ? "0" : "") + chr;
    },
    ""
  );

  console.log("Signature: " + signature);

  return signature;
}
