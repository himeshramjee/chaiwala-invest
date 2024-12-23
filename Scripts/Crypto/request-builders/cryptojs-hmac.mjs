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
