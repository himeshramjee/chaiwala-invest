import crypto from "crypto";

// Define your API key and secret (replace with your actual keys)
const API_KEY = "9apE4WnflEMq2cQIWc";
const API_SECRET = "iZTbq6MTNxDGryZZVusvnEf0MH1mHiWjgT4x";

// Function to create the signature for the request
function sign(parameters, secret) {
  const timestamp = Date.now().toString();
  const recvWindow = "5000";
  const signature = crypto
    .createHmac("sha256", secret)
    .update(timestamp + API_KEY + recvWindow + parameters)
    .digest("hex");
  return { timestamp, recvWindow, signature };
}

// Function to get ETH balance
async function getEthBalance() {
  const parameters = "accountType=UNIFIED&COIN=ETH";
  const { timestamp, recvWindow, signature } = sign(parameters, API_SECRET);

  const url = `https://api.bybit.com/v5/asset/transfer/query-account-coins-balance?${parameters}`;

  // Set up the request headers
  const headers = {
    "X-BAPI-API-KEY": API_KEY,
    "X-BAPI-TIMESTAMP": timestamp,
    "X-BAPI-RECV-WINDOW": recvWindow,
    "X-BAPI-SIGN": signature,
  };

  // Make the GET request to Bybit API
  const response = await fetch(url, { method: "GET", headers });

  // Check if the response is okay (status in the range 200-299)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Parse and return the JSON response
  const data = await response.json();
  console.log(data.result.balance.find((b) => b.coin === "ETH"));
}

export const handler = async (event, context) => {
  // Call the function to get ETH balance
  await getEthBalance();
};

export default handler;
