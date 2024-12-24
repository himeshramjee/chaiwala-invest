const bybitProviderAPIConfig = {
  providerShortCode: "BYB",
  docs: "// https://bybit-exchange.github.io/docs/v5/error",
  url: "https://api.bybit.nl/",
  pathCoinBalance: "v5/asset/transfer/query-account-coin-balance",
  pathAllCoinsBalance: "v5/asset/transfer/query-account-coins-balance",
  apiKey: "O7XDC2RbTpSUX5XWB7",
  apiKeySecret: "I02fdY8ejBAQ8b7Zo6jXa9roOWhp6oabUb8l",
  recvWindow: 10000, // Higher than default of 5000 to account for network/AWS Lambda latency
  timestamp: Date.now().toString(),
  coinsToQuery:
    "USDT,BTC,ETH,SOL,AR,FTM,NEAR,SEI,TON,INJ,RUNE,SUI,FET,MANTA,GALA,NOT",
  unsupportedCoins: "AKT,OM,BAKED,TOOKER",
};

export default bybitProviderAPIConfig;
