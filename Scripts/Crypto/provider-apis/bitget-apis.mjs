import { bitgetProviderAPIConfig } from "../provider-configs/bitget-config.mjs";
import buildBitgetRequest from "../request-builders/bitget-builder.mjs";

export async function getAllCoinsBalanceBitget(singleCoin) {
  // FIXME: Remove hack
  let paramsHack;
  if (singleCoin) {
    paramsHack = { coin: singleCoin };
  }

  const { url, headers } = buildBitgetRequest(
    paramsHack,
    bitgetProviderAPIConfig.paths.SPOT_COINS_BALANCES
  );

  // https://www.npmjs.com/package/node-fetch
  // const response = await fetch(apiEndpoint, requestParams);
  console.log(
    "Calling Bitget API...\n" +
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
    const errMsg =
      "API returned error. RetCode: " +
      responseJson.retCode +
      ", RetMsg: " +
      responseJson.retMsg +
      ". Additional info: " +
      additionalInfo;
    ". See " + bitgetProviderAPIConfig.docs + ".";
    console.error(errMsg);

    return responseJson;
  } else {
    return responseJson?.data;
  }
}
