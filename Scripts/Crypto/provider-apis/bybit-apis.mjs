// https://spreadsheet.dev/comprehensive-guide-urlfetchapp-apps-script
// https://bybit-exchange.github.io/docs/v5/error
// https://www.postman.com/postman/postman-answers/overview

import { bybitProviderAPIConfig } from "../provider-configs/bybit-config.mjs";
import buildBybitRequest from "../request-builders/bybit-builder.mjs";

export async function getAllCoinsBalanceBybit(coinsFilter) {
  const { url, headers } = buildBybitRequest(
    {
      accountType: "UNIFIED",
      coin: coinsFilter || bybitProviderAPIConfig.coinsToQuery,
    },
    bybitProviderAPIConfig.paths.ALL_COINS_BALANCE
  );

  // https://www.npmjs.com/package/node-fetch
  // const response = await fetch(apiEndpoint, requestParams);
  console.log(
    "Calling Bybit API...\n" +
      url +
      " with headers: \n" +
      JSON.stringify(headers)
  );
  const response = await fetch(url, { method: "GET", headers });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const responseJson = await response.json();

  if (responseJson?.retCode > 0) {
    let additionalInfo = "";

    if (responseJson.retCode === 10002) {
      // Time sync issue, add time latency/drift difference
      additionalInfo =
        "Time difference: " +
        calculateTimeDifference(responseJson.retMsg).driftValue;
    }
    const errMsg =
      "API returned error. RetCode: " +
      responseJson.retCode +
      ", RetMsg: " +
      responseJson.retMsg +
      ". Additional info: " +
      additionalInfo;
    ". See " + bybitProviderAPIConfig.docs + ".";
    console.error(errMsg);

    return responseJson;
  } else {
    return responseJson?.result?.balance;
  }
}

export async function getBybitServerTime() {
  const { url, headers } = buildBybitRequest(
    "",
    bybitProviderAPIConfig.paths.SERVER_TIME
  );

  try {
    console.log("Calling Time api: ", url);
    const response = await fetch(url, {
      method: "GET",
      header: headers,
    });
    const responseJson = await response.json();

    return parseFloat(responseJson.result.timeSecond); // Convert string to float
  } catch (error) {
    console.error("Error fetching Bybit server time:", error);
    throw error; // Rethrow the error for handling in the caller
  }
}

function calculateTimeDifference(returnMsg) {
  // e.g "RetCode: 10002, RetMsg: invalid request, please check your server timestamp or recv_window param. req_timestamp[1735024930733], server_timestamp[1735024960733], recv_window[5000]";
  // Regular expression to match the timestamp
  const requestTimestampRegex = /req_timestamp\[(\d+)\]/;
  const serverTimestampRegex = /server_timestamp\[(\d+)\]/;
  const receiveWindowRegex = /recv_window\[(\d+)\]/;

  // Execute the regex on the input string
  const requestMatch = returnMsg.match(requestTimestampRegex);
  const serverMatch = returnMsg.match(serverTimestampRegex);
  const recieveWindowMatch = returnMsg.match(receiveWindowRegex);

  let requestTimestamp = 0;
  let serverTimestamp = 0;
  let receiveWindow = 0;

  if (requestMatch && requestMatch[1]) {
    requestTimestamp = requestMatch[1];
  }
  if (serverMatch && serverMatch[1]) {
    serverTimestamp = serverMatch[1];
  }
  if (recieveWindowMatch && recieveWindowMatch[1]) {
    receiveWindow = recieveWindowMatch[1];
  }

  return {
    requestTimestamp: requestTimestamp,
    serverTimestamp: serverTimestamp,
    driftValue: `${(serverTimestamp - requestTimestamp) / 1000}s.`,
    receiveWindow: receiveWindow,
  };
}
