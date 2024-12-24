import { getAllCoinsBalance } from "./provider-apis/bybit-apis.mjs";

export const handler = async (event, context) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  let response;
  try {
    console.log("Query params: ", event.queryStringParameters);
    response = await getAllCoinsBalance(
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
};

export default handler;
