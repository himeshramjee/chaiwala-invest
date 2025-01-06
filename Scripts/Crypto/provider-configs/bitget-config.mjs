export const BITGET_API_PATHS = Object.freeze({
  ALL_ACCOUNT_BALANCES: "/api/v2/account/all-account-balance",
  FUNDING_COINS_BALANCES: "/api/v2/account/funding-assets",
  SPOT_COINS_BALANCES: "/api/v2/spot/account/assets",
  SERVER_TIME: "/api/v2/public/time",
});

export const bitgetProviderAPIConfig = {
  providerShortCode: "BG",
  docs: "https://www.bitget.com/api-doc/common/intro",
  url: "https://api.bitget.com/",
  paths: BITGET_API_PATHS,
  timestamp: Math.round(new Date()),
  apiKey: "",
  apiSecret: "",
  apiAccessPassphrase: "",
  coinsToQuery:
    "USDT,BTC,ETH,SOL,AR,FTM,NEAR,SEI,TON,INJ,RUNE,SUI,FET,MANTA,GALA,NOT,AKT,OM,BAKED,TOOKER",
  unsupportedCoins: "",
};
