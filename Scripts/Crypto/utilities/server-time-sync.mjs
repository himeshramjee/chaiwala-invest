import { bybitProviderAPIConfig } from "../exchange-configs/bybit-config.mjs";
import { getBybitServerTime } from "../provider-apis/bybit-apis.mjs";

const allowedTimeDriftThreshold = bybitProviderAPIConfig.recvWindow; // Define an acceptable threshold in seconds

export async function timeSyncedWithProvider() {
  let providerTime;

  try {
    providerTime = await getBybitServerTime();
  } catch (e) {
    return false;
  }
  const chaiTime = Math.floor(Date.now() / 1000); // Current time in seconds since epoch

  // Calculate the difference
  const timeDifference = providerTime - chaiTime;

  if (Math.abs(timeDifference) > allowedTimeDriftThreshold) {
    console.error("Time difference detected.");
    console.error(
      `ProviderTime[${providerTime}], ChaiTime[${chaiTime}], Drift[${timeDifference}], DriftLimit[${allowedTimeDriftThreshold}].`
    );
    return false;
  } else {
    return true;
  }
}
