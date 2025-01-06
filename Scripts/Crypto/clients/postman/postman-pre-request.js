const CryptoJS = require("crypto-js");

class PreRequest {
  constructor() {
    // no-op
  }

  static buildQueryStringFromObject(queryParams) {
    return Object.keys(queryParams)
      .map((key) => `${key}=${queryParams[key]}`)
      .sort()
      .join("&");
  }

  static buildQueryStringFromArray(queryParams = pm.request.url.query) {
    return queryParams
      ?.map((p) => `${p.key}=${p.value}`)
      .sort()
      .join("&");
  }

  static addHeadersToPmRequest(arrHeadersToAdd) {
    pm.request.headers.add({ key: "Content-Type", value: "application/json" });
    pm.request.headers.add({ key: "Accept-Encoding", value: "gzip, deflate" });

    arrHeadersToAdd.forEach((header) => {
      pm.request.headers.add({ key: header.key, value: header.value });
    });
  }

  static getSignatureForAThing(aThing, aSecret, doBase64Encoding = false) {
    let encoding = CryptoJS.enc.Hex;
    if (doBase64Encoding) {
      encoding = CryptoJS.enc.Base64;
    }

    // Generate HMAC SHA256 signature
    return CryptoJS.HmacSHA256(aThing, aSecret).toString(encoding);
  }
}

class BybitPreRequest extends PreRequest {
  constructor() {
    super();
  }

  static NAME_API_KEY = "X-BAPI-API-KEY";
  static NAME_API_SECRET = "X-BAPI-API-KEY-SECRET";
  static NAME_REQUEST_TIMESTAMP = "X-BAPI-TIMESTAMP";
  static NAME_REQUEST_SIGNATURE = "X-BAPI-SIGN";
  static NAME_REQUEST_RECV_WINDOW = "X-BAPI-RECV-WINDOW";
  static NAME_ACCOUNT_TYPE = "accountType";
  static NAME_REQUEST_PATH_ALL_COINS_BALANCE = "apiPathGetAllCoinsBalance";

  static DEFAULT_RECV_WINDOW = 5000;
  static DEFAULT_ACCOUNT_TYPE_QUERY = "UNIFIED";

  // Build query string params and signed request
  #payload = {
    method: "GET",
    path: pm.variables.replaceIn(
      `{{${BybitPreRequest.NAME_REQUEST_PATH_ALL_COINS_BALANCE}}}`
    ),
    timestamp: Date.now().toString(),
    apiKey: pm.variables.replaceIn(`{{${BybitPreRequest.NAME_API_KEY}}}`),
    recvWindow: BybitPreRequest.DEFAULT_RECV_WINDOW,
    queryString: BybitPreRequest.buildQueryStringFromObject({
      accountType: BybitPreRequest.DEFAULT_ACCOUNT_TYPE_QUERY,
      coin:
        pm.request.url.query.get("coin") ||
        pm.variables.replaceIn("{{coinsToQuery}}"), // Coin tickers are case-sensitive
    }),
    apiSecret: pm.variables.replaceIn(`{{${BybitPreRequest.NAME_API_SECRET}}}`),
  };

  #requestHeaders = [
    { key: BybitPreRequest.NAME_API_KEY, value: this.#payload.apiKey },
    {
      key: BybitPreRequest.NAME_REQUEST_TIMESTAMP,
      value: Date.now(),
    },
    {
      key: BybitPreRequest.NAME_REQUEST_SIGNATURE,
      value: this.getPayloadSignature(this.#payload),
    },
    {
      key: BybitPreRequest.NAME_REQUEST_RECV_WINDOW,
      value: this.#payload.recvWindow.toString(),
    },
  ];

  getPayloadSignature(payloadToSign) {
    // Generate HMAC SHA256 signature
    // const payload = CryptoJS.enc.Utf8.parse(payload.timestamp + payload.apiKey + payload.recvWindow + payload.queryString);
    const requestParams =
      payloadToSign.timestamp +
      payloadToSign.apiKey +
      payloadToSign.recvWindow +
      payloadToSign.queryString;
    const secretKey = payloadToSign.apiSecret; // CryptoJS.enc.Utf8.parse(apiSecret);

    return BybitPreRequest.getSignatureForAThing(requestParams, secretKey);
  }

  runPreRequest() {
    // Add signature to headers
    BybitPreRequest.addHeadersToPmRequest(this.#requestHeaders);

    // Add Request Params
    pm.request.addQueryParams(
      `${BybitPreRequest.NAME_ACCOUNT_TYPE}=${BybitPreRequest.DEFAULT_ACCOUNT_TYPE_QUERY}`
    );

    if (
      !pm.request.url.query.get("coin") ||
      pm.request.url.query.get("coin") === ""
    ) {
      // Coin tickers are case-sensitive
      pm.request.addQueryParams(
        "coin=" + pm.variables.replaceIn("{{coinsToQuery}}")
      );
    }
  }
}

class BitgetPreRequest extends PreRequest {
  constructor() {
    super();
  }

  static NAME_ACCESS_KEY = "ACCESS-KEY";
  static NAME_API_SECRET = "API-KEY-SECRET";
  static NAME_REQUEST_SIGNATURE = "ACCESS-SIGN";
  static NAME_REQUEST_TIMESTAMP = "ACCESS-TIMESTAMP";
  static NAME_ACCESS_PASSPHRASE = "ACCESS-PASSPHRASE";

  // Build query string params and signed request
  #payload = {
    method: "GET", // .toUpperCase()
    path: pm.request.url.getPath(),
    timestamp: Math.round(new Date()),
    queryString: BitgetPreRequest.buildQueryStringFromArray(),
    apiKey: pm.variables.replaceIn(`{{${BitgetPreRequest.NAME_ACCESS_KEY}}}`),
    apiSecret: pm.variables.replaceIn(
      `{{${BitgetPreRequest.NAME_API_SECRET}}}`
    ),
    apiAccessPassphrase: pm.variables.replaceIn(
      `{{${BitgetPreRequest.NAME_ACCESS_PASSPHRASE}}}`
    ),
    jsonBody: {},
  };

  #requestHeaders = [
    { key: BitgetPreRequest.NAME_ACCESS_KEY, value: this.#payload.apiKey },
    {
      key: BitgetPreRequest.NAME_REQUEST_SIGNATURE,
      value: this.getPayloadSignature(this.#payload),
    },
    {
      key: BitgetPreRequest.NAME_REQUEST_TIMESTAMP,
      value: this.#payload.timestamp,
    },
    {
      key: BitgetPreRequest.NAME_ACCESS_PASSPHRASE,
      value: this.#payload.apiAccessPassphrase,
    },
    {
      key: "locale",
      value: "en-US",
    },
    {
      key: "Content-Type",
      value: "application/json",
    },
  ];

  getPayloadSignature(payload) {
    let hasQueryString = payload.queryString?.length > 0;
    let addJsonBody = payload.method.toUpperCase() !== "GET";
    const requestParams =
      payload.timestamp +
      payload.method.toUpperCase() +
      payload.path +
      (hasQueryString ? `?${payload.queryString}` : "") +
      (addJsonBody ? payload.jsonBody : "");

    return BitgetPreRequest.getSignatureForAThing(
      requestParams,
      payload.apiSecret,
      true
    );
  }

  runPreRequest() {
    // Add signature to headers
    BitgetPreRequest.addHeadersToPmRequest(this.#requestHeaders);
  }
}

// const bybitPreRequest = new BybitPreRequest();
// bybitPreRequest.runPreRequest();
const bitgetPreRequest = new BitgetPreRequest();
bitgetPreRequest.runPreRequest();
