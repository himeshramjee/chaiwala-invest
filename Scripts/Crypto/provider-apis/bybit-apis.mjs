// https://spreadsheet.dev/comprehensive-guide-urlfetchapp-apps-script
// https://bybit-exchange.github.io/docs/v5/error
// https://www.postman.com/postman/postman-answers/overview

import bybitProviderAPIConfig from "../exchange-configs/bybit-config.mjs";
import buildBybitRequest from "../request-builders/bybit-builder.mjs";

export async function getAllCoinsBalance() {
  const { url, headers } = buildBybitRequest({
    accountType: "UNIFIED",
    coin: bybitProviderAPIConfig.coinsToQuery,
  });

  // https://www.npmjs.com/package/node-fetch
  // const response = await fetch(apiEndpoint, requestParams);
  const response = await fetch(url, { method: "GET", headers });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const responseJson = await response.json();

  if (responseJson?.retCode > 0) {
    const errMsg =
      "API returned error. RetCode: " +
      responseJson.retCode +
      ", RetMsg: " +
      responseJson.retMsg +
      ". See " +
      bybitProviderAPIConfig.docs +
      ".";
    console.error(errMsg);
    throw new Error(errMsg);
  } else {
    return responseJson?.result?.balance;
  }
}
