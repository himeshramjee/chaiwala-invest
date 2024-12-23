const bybitProviderAPIConfig = {
  providerShortCode: "BYB",
  docs: "// https://bybit-exchange.github.io/docs/v5/error",
  url: "https://api.bybit.com/",
  pathCoinBalance: "v5/asset/transfer/query-account-coin-balance",
  pathAllCoinsBalance: "v5/asset/transfer/query-account-coins-balance",
  apiKey: "",
  apiKeySecret: "",
  recvWindow: 50000,
  timestamp: Date.now().toString(),
  coinsToQuery: "ETH", // "USDT,BTC,ETH,SOL,AR,FTM,NEAR,SEI,TON,INJ,RUNE,SUI,FET,MANTA,GALA,NOT,TOOKER",
  unsupportedCoins: "AKT,OM,BAKED",
};

export default bybitProviderAPIConfig;
