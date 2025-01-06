import { getAllCoinsBalanceBybit } from "../../provider-apis/bybit-apis.mjs";
import { getAllCoinsBalanceBitget } from "../../provider-apis/bitget-apis.mjs";
import { timeSyncedWithBybit } from "../../utilities/server-time-sync.mjs";

export const handler = async (event, context) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));
  console.log("Query params: ", event.queryStringParameters);
  const urlPath = event.path;

  if (urlPath.includes("bybit")) {
    return handleBybitCall(event);
  } else if (urlPath.includes("bitg")) {
    return handleBitgetCall(event);
  } else {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Invalid Request: Path not found.",
      },
    };
  }
};

async function handleBitgetCall(event) {
  let response;
  try {
    response = await getAllCoinsBalanceBitget(
      event.queryStringParameters?.coin
    );
    console.log("Received Response: \n", response);
  } catch (e) {
    console.error(e);
    console.error("Failed to handle event: ", e);
    response = {
      error: e,
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response),
  };
}

async function handleBybitCall(event) {
  if (await timeSyncedWithBybit()) {
    let response;

    try {
      response = await getAllCoinsBalanceBybit(
        event.queryStringParameters?.coin?.replace(/\s/g, "")
      );
      console.log("Received Response: \n", response);
    } catch (e) {
      console.error(e);
      console.error("Failed to handle event: ", e);
      response = {
        error: e,
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    };
  } else {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Chai time not in sycn with Provider.",
      },
    };
  }
}

export default handler;
