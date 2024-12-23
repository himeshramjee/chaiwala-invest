import { getAllCoinsBalance } from "./provider-apis/bybit-apis.mjs";

export const handler = async (event, context) => {
  // TODO: Consume from event
  return await getAllCoinsBalance();
};

export default handler;
